import PageHeader from "@/components/layout/PageHeader";
import { render, screen } from "@testing-library/react";

describe("PageHeader responsive layout", () => {
  it("renders the page title", () => {
    render(<PageHeader title="Select Auction" />);
    expect(screen.getByRole("heading", { level: 1, name: "Select Auction" })).toBeInTheDocument();
  });

  it("uses stacked mobile layout classes and wraps long titles", () => {
    const { container } = render(
      <PageHeader
        title="Import Manifest With A Very Long Title"
        actions={<button type="button">Instructions</button>}
      />,
    );

    const header = container.querySelector("div");
    expect(header).toHaveClass("flex-col", "sm:flex-row");
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("break-words", "min-w-0");
    expect(screen.getByRole("button", { name: "Instructions" })).toBeInTheDocument();
  });
});
