import { parse } from "csv-parse/browser/esm/sync";

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

    for (const columns of records) {
      const nonProfitObj = {
        id: nonprofitsData.length + 1,
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

      // Get only logo images in the main flow
      const logoImages = await getLogoImages(
        nonProfitObj.nonprofit_name.replace(/ /g, "_")
      );
      nonProfitObj.logo = logoImages;

      nonprofitsData.push(nonProfitObj);
    }

    return nonprofitsData;
  } catch (error) {
    console.error("Error fetching nonprofits:", error);
  }
};
