import { Button, FormActions } from "@/components/common/Button";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders primary form buttons with consistent sizing", () => {
    render(
      <FormActions>
        <Button type="submit" variant="primary" layout="form">
          Save
        </Button>
        <Button type="button" variant="secondary" layout="form">
          Reset
        </Button>
      </FormActions>,
    );

    const save = screen.getByRole("button", { name: "Save" });
    const reset = screen.getByRole("button", { name: "Reset" });

    expect(save).toHaveClass("min-h-[44px]", "bg-[#d36838]", "xl:w-[12rem]");
    expect(reset).toHaveClass("min-h-[44px]", "bg-[#181512]", "xl:w-[12rem]");
  });

  it("renders compact modal buttons", () => {
    render(
      <>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("min-h-[36px]", "text-sm");
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("min-h-[36px]", "text-sm");
  });
});
