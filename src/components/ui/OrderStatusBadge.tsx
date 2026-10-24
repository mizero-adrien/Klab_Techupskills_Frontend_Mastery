import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "../../constants/order";
import type { OrderStatus } from "../../types/order";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_STYLES[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export default OrderStatusBadge;