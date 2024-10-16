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
              <span className="font-bold">Members:</span>
              {rationCard.members && rationCard.members.length > 0 ? (
                <ul className="list-disc ml-5 mt-2">
                  {rationCard.members.map((member, index) => (
                    <li key={index}>
                      <span className="font-medium">{member.fullName}</span>{" "}
                      {member.age && <span>- Age: {member.age}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No members listed</span>
              )}
            </div>

            {/* <div>
              <span className="font-bold">Application Status:</span>{" "}
              <span className="text-yellow-500">
                {rationCard.isAdminApproved}
              </span>
            </div> */}

            <div className="mt-4">
              <span className="font-bold text-lg">Address Information:</span>
              {rationCard.address ? (
                <div className="mt-2 space-y-1">
                  <div>
                    <span className="font-bold">Street:</span>{" "}
                    <span>{rationCard.address.street || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold">District (Taluka):</span>{" "}
                    <span>{rationCard.address.taluka || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold">City:</span>{" "}
                    <span>{rationCard.address.city || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold">State:</span>{" "}
                    <span>{rationCard.address.state || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold">Pincode:</span>{" "}
                    <span>{rationCard.address.postalCode || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <span>No address available</span>
              )}
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
