import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // First check if tables exist and create if they don't
    console.log("Seeding database...");

    // Seed example favorites for demo purposes
    const exampleFavorites = [
      { cityId: "5128581", name: "New York", country: "United States" },
      { cityId: "2643743", name: "London", country: "United Kingdom" },
      { cityId: "1850147", name: "Tokyo", country: "Japan" },
      { cityId: "2988507", name: "Paris", country: "France" },
      { cityId: "2147714", name: "Sydney", country: "Australia" }
    ];

    console.log("Checking existing favorites...");
    const existingFavorites = await db.query.favorites.findMany();

    if (existingFavorites.length === 0) {
      console.log("Seeding favorite cities...");
      
      for (const favorite of exampleFavorites) {
        await db.insert(schema.favorites).values({
          cityId: favorite.cityId,
          name: favorite.name,
          country: favorite.country,
          addedAt: new Date()
        });
      }
      
      console.log("Favorites seeded successfully");
    } else {
      console.log("Favorites already exist, skipping seeding");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
