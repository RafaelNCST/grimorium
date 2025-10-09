import { Bone, Wind, Dumbbell, Shield, Beef, Skull, type LucideIcon } from "lucide-react";

export interface IPhysicalType {
  value: string;
  translationKey: string;
  icon: LucideIcon;
}

export const PHYSICAL_TYPES_CONSTANT: IPhysicalType[] = [
  {
    value: "malnourished",
    translationKey: "physical_type.malnourished",
    icon: Bone,
  },
  {
    value: "thin",
    translationKey: "physical_type.thin",
    icon: Wind,
  },
  {
    value: "athletic",
    translationKey: "physical_type.athletic",
    icon: Dumbbell,
  },
  {
    value: "robust",
    translationKey: "physical_type.robust",
    icon: Shield,
  },
  {
    value: "corpulent",
    translationKey: "physical_type.corpulent",
    icon: Beef,
  },
  {
    value: "aberration",
    translationKey: "physical_type.aberration",
    icon: Skull,
  },
];
