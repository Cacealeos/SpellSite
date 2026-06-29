import CustomRadio from "./Radio";

type Potency = "MINOR" | "MAJOR" | "EXTREME" | "CATACLYSMIC";

type PotencyOption = {
  value: Potency;
  label: string;
  description: string;
};

type PotencySelectorProps = {
  options: PotencyOption[];
  selectedPotency: Potency;
  setSelectedPotency: (potency: Potency) => void;
};

export default function PotencySelector({
  options,
  selectedPotency,
  setSelectedPotency,
}: PotencySelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-bold text-cyan-400">Potency</h2>

      <div className="space-y-3">
        {options.map((option) => (
          <CustomRadio
            key={option.value}
            selected={selectedPotency === option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            onClick={() => setSelectedPotency(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
