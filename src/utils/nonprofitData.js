import { parse } from "csv-parse/browser/esm/sync";

const CACHE_KEY = "nonprofit_data_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const isLocalStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const getCachedData = () => {
  if (!isLocalStorageAvailable()) return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  } catch (error) {
    console.warn("Error accessing cache:", error);
    return null;
  }
};

const setCachedData = (data) => {
  if (!isLocalStorageAvailable()) return;

  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Error setting cache:", error);
  }
};

// Function to fetch files with a specific prefix
const fetchFiles = async (prefix, bucketName) => {
  const baseUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o`;
  try {
    const response = await fetch(
      `${baseUrl}?prefix=${encodeURIComponent(prefix)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching files with prefix ${prefix}:`, error);
    return [];
  }
};

// Function to get logo images for a nonprofit
async function getLogoImages(
  nonprofit_name,
  bucketName = "match_israel_media"
) {
  const logoPrefix = `${nonprofit_name}/logo/`;
  const logoFiles = await fetchFiles(logoPrefix, bucketName);
  return logoFiles.map(
    (file) => `https://storage.googleapis.com/${bucketName}/${file.name}`
  );
}

// Function to get gallery images for a nonprofit
export async function getGalleryImages(
  nonprofit_name,
  bucketName = "match_israel_media"
) {
  const galleryPrefix = `${nonprofit_name}/gallery/`;
  const galleryFiles = await fetchFiles(galleryPrefix, bucketName);

  if (galleryFiles.length === 0) {
    return [];
  }

  return galleryFiles.map(
    (file) => `https://storage.googleapis.com/${bucketName}/${file.name}`
  );
}

export const fetchNonprofitData = async () => {
  // Try to get cached data first
  const cachedData = getCachedData();
  if (cachedData) {
    return cachedData;
  }

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/13cpTyNm2Dy15pPlsPRm6yKLopVTBMrsmlgvIW-U_x7Y/export?format=csv";

  try {
    const response = await fetch(sheetUrl);
    const csvText = await response.text();

    const records = parse(csvText, {
      skip_empty_lines: true,
      from_line: 2,
      trim: true,
    });

    const nonprofitsData = [];

    // Process nonprofits in batches
    const BATCH_SIZE = 5;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (columns, batchIndex) => {
        const nonProfitObj = {
          id: i + batchIndex + 1,
          contact_name: columns[1] || "",
          nonprofit_name: columns[4] || "",
          contact_role: columns[5] || "",
          phone: columns[6] || "",
          email: columns[7] || "",
          donation_link: columns[15] || "",
          homepage_english: columns[16] || "",
          description: columns[17] || "",
          preferred_contact_method: columns[20] || "",
          whatsapp_text: columns[22] || "",
          email_subject: columns[23] || "",
          email_text: columns[24] || "",
        };

        const logoImages = await getLogoImages(
          nonProfitObj.nonprofit_name.replace(/ /g, "_")
        );
        nonProfitObj.logo = logoImages;

        return nonProfitObj;
      });

      const batchResults = await Promise.all(batchPromises);
      nonprofitsData.push(...batchResults);

      // If this isn't the last batch, add a small delay
      if (i + BATCH_SIZE < records.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Cache the processed data
    setCachedData(nonprofitsData);

    return nonprofitsData;
  } catch (error) {
    console.error("Error fetching nonprofits:", error);
    return [];
  }
};
