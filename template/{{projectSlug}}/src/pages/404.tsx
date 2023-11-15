import { PageError } from "@/components/PageError";

export default function PageNotFound() {
  const title = "Page Not Found";
  const description = "The page you are looking for does not exist.";

  return <PageError title={title} description={description} />;
}
