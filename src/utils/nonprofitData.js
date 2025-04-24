import { parse } from "csv-parse/browser/esm/sync";

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
      nonprofitsData.push({
        id: nonprofitsData.length + 1,
        contact_name: columns[1] || "",
        nonprofit_name: columns[4] || "",
        contact_role: columns[5] || "",
        phone: columns[6] || "",
        email: columns[7] || "",
        logo: columns[13] || "/placeholder-image.jpg",
        additional_images: columns[14]
          ? columns[14].split(";").filter((url) => url)
          : [],
        donation_link: columns[15] || "",
        homepage_english: columns[16] || "",
        description: columns[17] || "",
        preferred_contact_method: columns[20] || "",
      });
    }

    return nonprofitsData;
  } catch (error) {
    console.error("Error fetching nonprofits:", error);
  }
};
