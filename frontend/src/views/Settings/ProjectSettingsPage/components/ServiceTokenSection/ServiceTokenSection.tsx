import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNotificationContext } from "@app/components/context/Notifications/NotificationProvider";
import { Button, DeleteActionModal } from "@app/components/v2";
import { usePopUp } from "@app/hooks";
import { useDeleteServiceToken } from "@app/hooks/api";

import { AddServiceTokenModal } from "./AddServiceTokenModal";
import { ServiceTokenTable } from "./ServiceTokenTable";

type DeleteModalData = { name: string; id: string };

export const ServiceTokenSection = () => {
  const { t } = useTranslation();
  const { createNotification } = useNotificationContext();
  const deleteServiceToken = useDeleteServiceToken();

  const { popUp, handlePopUpToggle, handlePopUpClose, handlePopUpOpen } = usePopUp([
    "createAPIToken",
    "deleteAPITokenConfirmation"
  ] as const);

  const onDeleteApproved = async () => {
    try {
      deleteServiceToken.mutateAsync(
        (popUp?.deleteAPITokenConfirmation?.data as DeleteModalData)?.id
      );
      createNotification({
        text: "Successfully deleted service token",
        type: "success"
      });

      handlePopUpClose("deleteAPITokenConfirmation");
    } catch (err) {
      console.error(err);
      createNotification({
        text: "Failed to delete service token",
        type: "error"
      });
    }
  };

  return (
    <div className="mb-6 max-w-screen-lg rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
      <div className="mb-2 flex justify-between">
        <p className="text-xl font-semibold text-mineshaft-100">
          {t("section.token.service-tokens")}
        </p>
        <Button
          colorSchema="secondary"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            handlePopUpOpen("createAPIToken");
          }}
        >
          Create token
        </Button>
      </div>
      <p className="mb-8 text-gray-400">{t("section.token.service-tokens-description")}</p>
      <ServiceTokenTable handlePopUpOpen={handlePopUpOpen} />
      <AddServiceTokenModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
      <DeleteActionModal
        isOpen={popUp.deleteAPITokenConfirmation.isOpen}
        title={`Delete ${
          (popUp?.deleteAPITokenConfirmation?.data as DeleteModalData)?.name || " "
        } service token?`}
        onChange={(isOpen) => handlePopUpToggle("deleteAPITokenConfirmation", isOpen)}
        deleteKey={(popUp?.deleteAPITokenConfirmation?.data as DeleteModalData)?.name}
        onClose={() => handlePopUpClose("deleteAPITokenConfirmation")}
        onDeleteApproved={onDeleteApproved}
      />
    </div>
  );
};
