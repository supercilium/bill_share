import { FC } from "react";
import { Modal } from "../../components/Modal";
import { QRCodeSVG } from "qrcode.react";
import { CopyButton } from "../CopyButton";
import { useTranslation } from "react-i18next";

interface SharePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePartyModal: FC<SharePartyModalProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
        <h2 className="title is-size-4 has-text-centered mb-6">
          {t("SCAN_QR_CODE")}
        </h2>
        <QRCodeSVG
          value={window.location.href}
          style={{ marginBottom: "32px" }}
        />
        <CopyButton
          onCopy={() => props.onClose()}
          title={t("BUTTON_COPY_LINK")}
        />
      </div>
    </Modal>
  );
};
