import React from "react";

interface FPSDetailsProps {
  fps: {
    fpsUserId: string;
    fullName: string;
    address: {
      street: string;
      taluka: string;
      district: string;
      pincode: Number;
    };
    mobileNumber: string;
    isAdminApproved: boolean;
  };
}

const FPSDetails: React.FC<FPSDetailsProps> = ({ fps }) => {
  return (
    <dialog id="fpsDetails" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">FPS Details</h3>
        <div className="py-4 space-y-3">
          <div>
            <span className="font-bold">FPS ID:</span>{" "}
            <span>{fps.fpsUserId}</span>
          </div>
          <div>
            <span className="font-bold">FPS Name:</span>{" "}
            <span>{fps.fullName}</span>
          </div>
          <div>
            <span className="font-bold">Address:</span>{" "}
            <span>{fps.address.taluka}</span>
          </div>
          <div>
            <span className="font-bold">Contact Number:</span>{" "}
            <span>{fps.mobileNumber}</span>
          </div>
          <div>
            <span className="font-bold">Status:</span>{" "}
            <span className="text-yellow-500">{fps.isAdminApproved}</span>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default FPSDetails;
