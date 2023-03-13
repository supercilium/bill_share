import { FC } from "react";
import { HeroLayout } from "../layouts/heroLayout";

export const ServiceAgreement: FC = () => {
  return (
    <HeroLayout>
      <div>
        <p className="title mb-6">Service Agreement</p>
        <p className="subtitle">
          Service is provided in the hope that it will be useful, but WITHOUT
          ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
          FITNESS FOR A PARTICULAR PURPOSE.
        </p>
      </div>
    </HeroLayout>
  );
};
