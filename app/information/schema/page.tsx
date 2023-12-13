import Image from "next/image";
import { Fragment } from "react";

const Schema = () => {
  const data = ["2", "3", "4", "5", "6", "1"];
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
