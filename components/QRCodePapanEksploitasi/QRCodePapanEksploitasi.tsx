import { Fragment } from "react";
import { QRCode } from "react-qrcode-logo";

type QRCodePapanEksploitasiProps = {
  nodeId: string;
  nodeName: string;
};

const QRCodePapanEksploitasi = ({
  nodeId,
  nodeName,
}: QRCodePapanEksploitasiProps) => {
  return (
    <Fragment>
      {/* barcode */}
      <div className="flex flex-col items-center mt-5">
        <div className="flex flex-row gap-1 mb-5 justify-center text-center text-[36px]">
          <span className="font-extrabold text-primary">
            {"PAPAN EKSPLOITASI"}
          </span>
          <span className="font-extrabold text-secondary">{" DIGITAL"}</span>
        </div>
        <div className="relative w-96 h-96 rounded-3xl border-8 border-primary flex justify-center">
          <div className="bg-secondary w-full h-full flex justify-center items-center rounded-2xl">
            <QRCode
              logoImage="/images/logo/logo_pupr.png"
              value={`https://airso.id/papan-eksploitasi?nodeId=${nodeId}`}
              size={300}
            />
          </div>
        </div>
        <div className="bg-white text-[36px] mt-5 font-extrabold text-primary text-center">
          {nodeName}
        </div>
        <div className="mt-2 font-extrabold text-primary">airso.id</div>
      </div>
    </Fragment>
  );
};

export default QRCodePapanEksploitasi;
