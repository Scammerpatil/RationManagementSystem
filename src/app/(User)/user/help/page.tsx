import React from "react";

const HelpPage = () => {
  return (
    <div className="p-5 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4">Help & FAQs</h2>
      <div className="space-y-4">
        {/* Accordion 1 */}
        <div className="collapse collapse-arrow bg-base-100 shadow-md">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-medium">
            How do I update my profile information?
          </div>
          <div className="collapse-content">
            <p>
              To update your profile information, navigate to the "Profile" page
              in your account settings. From there, you can edit fields such as
              your name, contact information, and other personal details.
            </p>
          </div>
        </div>

        {/* Accordion 2 */}
        <div className="collapse collapse-arrow bg-base-100 shadow-md">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-medium">
            How can I add or remove family members?
          </div>
          <div className="collapse-content">
            <p>
              To add a family member, go to the "Family Members" section in your
              profile and click on "Add Member." To remove a member, select the
              member and choose the "Remove" option.
            </p>
          </div>
        </div>

        {/* Accordion 3 */}
        <div className="collapse collapse-arrow bg-base-100 shadow-md">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-medium">
            What should I do if I forgot my password?
          </div>
          <div className="collapse-content">
            <p>
              If you forgot your password, click on the "Forgot Password" link
              on the login page. Follow the instructions to reset your password
              using your registered email.
            </p>
          </div>
        </div>

        {/* Accordion 4 */}
        <div className="collapse collapse-arrow bg-base-100 shadow-md">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-medium">
            How can I contact customer support?
          </div>
          <div className="collapse-content">
            <p>
              You can reach our customer support team by emailing
              support@example.com or calling our helpline at +1 (123) 456-7890
              during business hours.
            </p>
          </div>
        </div>

        {/* Accordion 5 */}
        <div className="collapse collapse-arrow bg-base-100 shadow-md">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-medium">
            How do I check my application status?
          </div>
          <div className="collapse-content">
            <p>
              To check your application status, go to the "Applications" section
              on your dashboard. Here, you’ll see the current status and any
              updates on your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
