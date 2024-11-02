import Tehsil from "@/models/Tehsil";

export async function updateTehsilRequirements(
  tehsilId: string,
  fpsId: string,
  session: any
) {
  const tehsil = await Tehsil.findById(tehsilId).session(session);

  if (!tehsil) {
    throw new Error("Tehsil not found");
  }

  tehsil.fpsShopUnder.push(fpsId);
  await tehsil.save({ session });
}
