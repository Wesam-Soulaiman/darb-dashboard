import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateRoute } from "../../../../hooks/locations/useRoutes";
import type { RouteLine, TransitRoute } from "../../../../types/route.types";
import type {
  RouteFormInputValues,
  RouteFormValues,
} from "../../../../schemas/locations/routeSchemas";
import RouteForm from "./RouteForm";

type UpdateRouteProps = {
  route: TransitRoute;
};

const DEFAULT_LINE: RouteFormInputValues["line"] = {
  type: "LineString",
  coordinates: [],
};

const normalizeRouteLine = (
  line?: RouteLine | null,
): RouteFormInputValues["line"] => {
  if (
    line?.type === "LineString" &&
    Array.isArray(line.coordinates) &&
    line.coordinates.every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        typeof point[0] === "number" &&
        typeof point[1] === "number",
    )
  ) {
    return {
      type: "LineString",
      coordinates: line.coordinates,
      bbox: Array.isArray(line.bbox) ? line.bbox : undefined,
    };
  }

  return DEFAULT_LINE;
};

const UpdateRoute = ({ route }: UpdateRouteProps) => {
  const { t } = useTranslation();
  const updateRoute = useUpdateRoute(route.id);

  const handleSubmit = async (
    values: RouteFormValues,
    handleClose: () => void,
  ) => {
    await updateRoute.mutateAsync({
      name: values.name,
      originPlaceId: values.originPlaceId,
      destinationPlaceId: values.destinationPlaceId,
      mode: values.mode,
      price: values.price,
      line: values.line,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("routes.editTitle")}
      tooltip={t("common.edit")}
      maxWidth="md"
    >
      {({ handleClose }) => (
        <RouteForm
          loading={updateRoute.isPending}
          submitLabel={t("routes.actions.update")}
          defaultValues={{
            name: route.name,
            originPlaceId: route.originPlaceId,
            destinationPlaceId: route.destinationPlaceId,
            mode: route.mode,
            price: route.price,
            line: normalizeRouteLine(route.line),
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateRoute;