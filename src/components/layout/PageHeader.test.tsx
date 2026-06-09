import PageHeader from "@/components/layout/PageHeader";
import { render, screen } from "@testing-library/react";

describe("PageHeader responsive layout", () => {
  it("renders responsive left-aligned page title sizing", () => {
    render(<PageHeader title="Select Auction" />);

    const heading = screen.getByRole("heading", { level: 1, name: "Select Auction" });
    expect(heading).toHaveClass("text-left", "text-xl", "sm:text-2xl", "lg:text-[1.75rem]");
  });

  it("keeps title left and actions on the right with vertical alignment", () => {
    const { container } = render(
      <PageHeader title="View Images" actions={<button type="button">Back</button>} />,
    );

    const header = container.firstElementChild;
    expect(header).toHaveClass("items-center", "justify-between");
    expect(screen.getByRole("heading", { level: 1, name: "View Images" })).toHaveClass("text-left");
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });
});
