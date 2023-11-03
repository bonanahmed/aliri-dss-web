import Image from "next/image";
import { Fragment } from "react";

const Schema = () => {
  const data = ["0001", "0002", "0003", "0004", "0005"];
  return (
    <Fragment>
      {data.map((item) => (
        <div key={item} className="w-full mb-3">
          <Image
            src={`/images/skema/${item}.jpg`}
            width={2000}
            height={2000}
            alt="kp"
          />
        </div>
      ))}
    </Fragment>
  );
};

export default Schema;
