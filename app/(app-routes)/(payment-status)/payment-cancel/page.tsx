import PaymentCancel from "@/components/pages/PaymentCancelPage";
import { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/utils/seo.utils";
import { getBusinessSettings } from "@/components/shared/actions/business-settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessSettings = await getBusinessSettings();

  return genMeta({
    title: "Payment Cancelled",
    description: "Your payment was cancelled.",
    noIndex: true,
    businessSettings,
  });
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const message = params.message;
  const orderId = params.order_id;
  const orderTrackingNo = params.order_tracking_no;

  return <PaymentCancel message={message} orderId={orderId} orderTrackingNo={orderTrackingNo} />;
}
