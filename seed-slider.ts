import fs from "fs";
import path from "path";
import https from "https";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, "public", "uploads", "foods");

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Images to download and seed
const foodImages = [
  {
    title: "Gourmet Burger",
    description: "A delicious juicy burger with fresh veggies and melted cheese.",
    targetFile: "burger.jpg",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Fresh Salmon Sushi",
    description: "Premium raw salmon served with soy sauce and wasabi.",
    targetFile: "sushi.jpg",
    url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Wood-fired Pizza",
    description: "Authentic Italian pizza baked in a traditional wood-fired oven.",
    targetFile: "pizza.jpg",
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
  },
];

const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res: any) => {
        // Handle redirects if unsplash does it
        if (res.statusCode === 301 || res.statusCode === 302) {
          return downloadImage(res.headers.location, filepath)
            .then(resolve)
            .catch(reject);
        }

        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", reject);
      })
      .on("error", reject);
  });
};

async function seed(): Promise<void> {
  try {
    console.log("Clearing old food images from database...");
    await prisma.foodImage.deleteMany();

    console.log("Downloading and saving images...");
    for (const image of foodImages) {
      const filepath = path.join(UPLOADS_DIR, image.targetFile);
      console.log(`Downloading ${image.title}...`);
      await downloadImage(image.url, filepath);

      // Insert into database
      await prisma.foodImage.create({
        data: {
          title: image.title,
          description: image.description,
          url: `/uploads/foods/${image.targetFile}`,
        },
      });

      console.log(`Saved ${image.title} to database.`);
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();