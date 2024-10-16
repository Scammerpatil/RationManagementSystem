import { RationCard } from "@/types/RationCard";

const RationCardModal = ({ rationCard }: { rationCard: RationCard }) => {
  return (
    <>
      <dialog
        id="rationCardDetails"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Ration Card Details</h3>
          <div className="py-4 space-y-3">
            <div>
              <span className="font-bold">Head of Family:</span>{" "}
              <span>{rationCard.head.fullName}</span>
            </div>
            <div>
              <span className="font-bold">Ration Card Number:</span>{" "}
              <span>{rationCard.rationCardNumber}</span>
            </div>
            <div>
              <span className="font-bold">Ration Card Type:</span>{" "}
              <span>{rationCard.cardType}</span>
            </div>
            <div>
              <span className="font-bold">Application Number:</span>{" "}
              <span>{rationCard.status}</span>
            </div>
            <div>
              <span className="font-bold">Application Status:</span>{" "}
              <span className="text-yellow-500">
                {rationCard.isAdminApproved}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default RationCardModal;
