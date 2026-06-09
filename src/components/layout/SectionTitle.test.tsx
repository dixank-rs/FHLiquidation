import SectionTitle from "@/components/layout/SectionTitle";
import { render, screen } from "@testing-library/react";

describe("SectionTitle", () => {
  it("renders a centered responsive section heading", () => {
    render(<SectionTitle id="generic-images-heading">Generic Item Images</SectionTitle>);

    const heading = screen.getByRole("heading", { level: 2, name: "Generic Item Images" });
    expect(heading).toHaveAttribute("id", "generic-images-heading");
    expect(heading).toHaveClass("text-center", "text-base", "sm:text-lg", "lg:text-2xl");
    expect(heading.parentElement).toHaveClass("items-center", "justify-center");
  });
});
