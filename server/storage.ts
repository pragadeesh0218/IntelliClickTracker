import { db } from "@db";
import { favorites } from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  async getFavorites() {
    return await db.query.favorites.findMany({
      orderBy: (favorites, { desc }) => [desc(favorites.addedAt)]
    });
  },
  
  async addFavorite(cityId: string, name: string, country: string) {
    return await db.insert(favorites).values({
      cityId,
      name,
      country,
      addedAt: new Date()
    }).returning();
  },
  
  async removeFavorite(cityId: string) {
    return await db.delete(favorites).where(eq(favorites.cityId, cityId));
  },
  
  async isFavorite(cityId: string) {
    const result = await db.query.favorites.findFirst({
      where: eq(favorites.cityId, cityId)
    });
    
    return !!result;
  }
};
