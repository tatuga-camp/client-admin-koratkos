export type Certificate = {
  id: string;
  createAt: string;
  updateAt: string;
  address: string;
  villageNumber: string | null;
  subdistrict: string;
  district: string;
  province: string;
  farmAddress: string;
  farmVillageNumber: string | null;
  farmSubdistrict: string;
  farmDistrict: string;
  farmProvince: string;
  totalRai: number;
  totalPlant: number;
  plantType: string[];
  latitude: string;
  longitude: string;
  certNumber: string;
  governorName: string;
  governorSignature: string;
  certRequestDate: string;
  certExpiredDate: string;
  farmerId: string;
};