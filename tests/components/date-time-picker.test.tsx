import { ComponentProps, MouseEvent, ReactNode } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { type DateRange, DayPicker } from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import DateTimePicker from "@/components/date-time-picker";
import type { VariantProps } from "class-variance-authority";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";
import { Provider, useAtom } from "jotai";
import { dateRangeAtom } from "@/models/orders-atom";
import advanceTimersByTime = jest.advanceTimersByTime;

// Arrange
jest.mock("@/components/ui/calendar", () => ({
  Calendar: (
    props: ComponentProps<typeof DayPicker> & {
      buttonVariant?: ComponentProps<typeof Button>["variant"];
    },
  ) => {
    const { className, ...dayPickerProps } = props;

    const isRangeMode =
      "mode" in dayPickerProps && dayPickerProps.mode === "range";

    return (
      <div
        data-testid="calendar"
        data-mode={dayPickerProps.mode}
        className={className}
      >
        <button
          data-testid="select-date-range"
          onClick={() => {
            if (isRangeMode && dayPickerProps.onSelect) {
              const mockRange: DateRange = {
                from: new Date(Date.UTC(2024, 0, 15, 10, 0, 0)),
                to: new Date(Date.UTC(2024, 0, 20, 15, 30, 0)),
              };

              dayPickerProps.onSelect(
                mockRange,
                mockRange.from!,
                {},
                {} as MouseEvent,
              );
            }
          }}
        >
          Select Date Range
        </button>
        <div data-testid="selected-range">
          {isRangeMode && dayPickerProps.selected
            ? dayPickerProps.selected.from && dayPickerProps.selected.to
              ? `${dayPickerProps.selected.from.toISOString()} - ${dayPickerProps.selected.to.toISOString()}`
              : dayPickerProps.selected.from
                ? `From: ${dayPickerProps.selected.from.toISOString()}`
                : "No selection"
            : "No selection"}
        </div>
      </div>
    );
  },
}));

jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverContent: ({
    children,
    className,
    align,
  }: {
    children: ReactNode;
    className?: string;
    align?: string;
  }) => (
    <div data-testid="popover-content" className={className} data-align={align}>
      {children}
    </div>
  ),
  PopoverTrigger: ({
    children,
    asChild,
  }: {
    children: ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    id,
    className,
    ...props
  }: ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }) => (
    <button
      data-testid="date-picker-button"
      onClick={onClick}
      data-variant={variant}
      id={id}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardFooter: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    htmlFor,
    className,
  }: {
    children: ReactNode;
    htmlFor?: string;
    className?: string;
  }) => (
    <label
      data-testid={`label-${htmlFor}`}
      htmlFor={htmlFor}
      className={className}
    >
      {children}
    </label>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    onChange,
    defaultValue,
    value,
    type,
    step,
    id,
    className,
    ...props
  }: ComponentProps<"input">) => (
    <input
      data-testid={`input-${id}`}
      onChange={onChange}
      defaultValue={defaultValue}
      value={value}
      type={type}
      step={step}
      id={id}
      className={className}
      {...props}
    />
  ),
}));

jest.mock("lucide-react", () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">📅</div>,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon">⬇️</div>,
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe("DateTimePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // Arrange
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );

    const { result } = renderHook(() => useAtom(dateRangeAtom), { wrapper });

    act(() => {
      result.current[1](undefined);
    });

    // Act
    render(<DateTimePicker />, { wrapper });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Initial State", () => {
    it("should render with default 'Select date' text when no date is selected", () => {
      // Assert
      expect(screen.getByText("Select date")).toBeInTheDocument();
      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
      expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
    });

    it("should render calendar in range mode", () => {
      // Assert
      const calendar = screen.getByTestId("calendar");
      expect(calendar).toHaveAttribute("data-mode", "range");
    });

    it("should render all required form elements", () => {
      // Assert
      expect(screen.getByTestId("calendar")).toBeInTheDocument();
      expect(screen.getByTestId("input-time-from")).toBeInTheDocument();
      expect(screen.getByTestId("input-time-to")).toBeInTheDocument();
      expect(screen.getByTestId("label-time-from")).toBeInTheDocument();
      expect(screen.getByTestId("label-time-to")).toBeInTheDocument();
    });

    it("should have correct input attributes for time inputs", () => {
      // Assert
      const fromTimeInput = screen.getByTestId("input-time-from");
      const toTimeInput = screen.getByTestId("input-time-to");

      expect(fromTimeInput).toHaveAttribute("type", "time");
      expect(fromTimeInput).toHaveAttribute("step", "1");
      expect(fromTimeInput).toHaveAttribute("id", "time-from");

      expect(toTimeInput).toHaveAttribute("type", "time");
      expect(toTimeInput).toHaveAttribute("step", "1");
      expect(toTimeInput).toHaveAttribute("id", "time-to");
    });

    it("should render proper component hierarchy", () => {
      // Assert
      expect(screen.getByTestId("popover")).toBeInTheDocument();
      expect(screen.getByTestId("popover-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
      expect(screen.getByTestId("card-footer")).toBeInTheDocument();
    });

    it("should have proper accessibility labels for time inputs", () => {
      // Assert
      const fromLabel = screen.getByTestId("label-time-from");
      const toLabel = screen.getByTestId("label-time-to");

      expect(fromLabel).toHaveAttribute("for", "time-from");
      expect(toLabel).toHaveAttribute("for", "time-to");
      expect(fromLabel).toHaveClass("sr-only");
      expect(toLabel).toHaveClass("sr-only");
    });

    it("should have correct button attributes", () => {
      // Assert
      const button = screen.getByTestId("date-picker-button");
      expect(button).toHaveAttribute("data-variant", "outline");
      expect(button).toHaveAttribute("id", "dates");
    });

    it("should have correct popover content alignment", () => {
      // Assert
      const popoverContent = screen.getByTestId("popover-content");
      expect(popoverContent).toHaveAttribute("data-align", "end");
    });
  });

  describe("Date Range Selection", () => {
    it("should update button text when a complete date range is selected", async () => {
      // Act
      const selectButton = screen.getByTestId("select-date-range");
      fireEvent.click(selectButton);

      // Assert
      await waitFor(() => {
        const button = screen.getByTestId("date-picker-button");

        expect(button).not.toHaveTextContent("Select date");
        expect(button.textContent).toMatch(/\d/);
      });
    });

    it("should pass selected date range to calendar component", async () => {
      // Act
      const selectButton = screen.getByTestId("select-date-range");
      fireEvent.click(selectButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("selected-range")).toHaveTextContent(
          "2024-01-15T10:00:00.000Z - 2024-01-20T15:30:00.000Z",
        );
      });
    });

    describe("Time Input Interaction", () => {
      it("should wait for every time parts to be inputted", async () => {
        // Arrange
        const user = userEvent.setup({
          advanceTimers: advanceTimersByTime,
          delay: 1000,
        });

        const fromTimeInput = screen.getByTestId("input-time-from");
        const toTimeInput = screen.getByTestId("input-time-to");

        // Act
        await user.type(fromTimeInput, "12:00:00");
        await user.type(toTimeInput, "13:00:00");

        // Assert
        expect(mockToast.error).not.toHaveBeenCalled();
      });

      it("should display the error toast when from > to", async () => {
        // Arrange
        const errorMessage = "End time cannot be before start time";

        // Act
        const fromTimeInput = screen.getByTestId("input-time-from");
        const toTimeInput = screen.getByTestId("input-time-to");

        fireEvent.change(fromTimeInput, { target: { value: "12:00:00" } });
        fireEvent.change(toTimeInput, { target: { value: "11:59:59" } });

        // Assert
        expect(mockToast.error).toHaveBeenCalledWith(errorMessage, {
          icon: expect.any(Object),
        });
        expect(fromTimeInput).toHaveDisplayValue("12:00:00");
        expect(toTimeInput).toHaveDisplayValue("11:59:59");
      });

      it.each([
        ["12:00:00", ""],
        ["", "12:00:00"],
        ["12:00:00", "12:00:00"],
      ])("should not display the error toast when from <= to", (from, to) => {
        // Arrange
        const fromTimeInput = screen.getByTestId("input-time-from");
        const toTimeInput = screen.getByTestId("input-time-to");

        // Act
        fireEvent.change(fromTimeInput, { target: { value: from } });
        fireEvent.change(toTimeInput, { target: { value: to } });

        // Assert
        expect(mockToast.error).not.toHaveBeenCalled();
        expect(fromTimeInput).toHaveDisplayValue(from);
        expect(toTimeInput).toHaveDisplayValue(to);
      });
    });
  });
});
