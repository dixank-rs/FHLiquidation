import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  List,
  Menu,
  Pencil,
  Trash2,
  X,
  ZoomIn,
  type LucideProps,
} from "lucide-react";

export const iconSizeSm = 18;
export const iconSizeMd = 20;
/** Compact size for edit/delete/help actions inside DataTable cells */
export const iconSizeTable = 15;

const hidden: Pick<LucideProps, "aria-hidden"> = { "aria-hidden": true };

export function IconChevronDown(props: LucideProps) {
  return <ChevronDown size={iconSizeSm} strokeWidth={2} {...hidden} {...props} />;
}

export function IconMenu(props: LucideProps) {
  return <Menu size={iconSizeMd} strokeWidth={2} {...hidden} {...props} />;
}

export function IconClose(props: LucideProps) {
  return <X size={iconSizeMd} strokeWidth={2} {...hidden} {...props} />;
}

export function IconEdit({ className, ...props }: LucideProps) {
  return (
    <Pencil
      size={iconSizeTable}
      strokeWidth={2}
      className={className ?? "text-[#d36838]"}
      {...hidden}
      {...props}
    />
  );
}

export function IconDelete({ className, ...props }: LucideProps) {
  return (
    <Trash2
      size={iconSizeTable}
      strokeWidth={2}
      className={className ?? "text-[#dc3545]"}
      {...hidden}
      {...props}
    />
  );
}

export function IconDeleteDisabled({ className, ...props }: LucideProps) {
  return (
    <Trash2
      size={iconSizeTable}
      strokeWidth={2}
      className={className ?? "text-[#adb5bd]"}
      {...hidden}
      {...props}
    />
  );
}

export function IconHelp({ className, ...props }: LucideProps) {
  return (
    <CircleHelp
      size={iconSizeTable}
      strokeWidth={2}
      className={className ?? "text-[#6c757d]"}
      {...hidden}
      {...props}
    />
  );
}

export function IconPinVisibility({ visible, ...props }: LucideProps & { visible: boolean }) {
  const Icon = visible ? EyeOff : Eye;
  return <Icon size={iconSizeMd} strokeWidth={2} className="text-[#181512]" {...hidden} {...props} />;
}

export function IconFileText(props: LucideProps) {
  return <FileText size={iconSizeMd} strokeWidth={2} {...hidden} {...props} />;
}

export function IconFileSpreadsheet(props: LucideProps) {
  return <FileSpreadsheet size={iconSizeSm} strokeWidth={2} className="text-[#d36838]" {...hidden} {...props} />;
}

export function IconListRows(props: LucideProps) {
  return <List size={iconSizeSm} strokeWidth={2} {...hidden} {...props} />;
}

export function IconZoomIn(props: LucideProps) {
  return <ZoomIn size={48} strokeWidth={1.75} className="text-white" {...hidden} {...props} />;
}

export function IconChevronLeft(props: LucideProps) {
  return <ChevronLeft size={iconSizeMd} strokeWidth={2} {...hidden} {...props} />;
}

export function IconChevronRight(props: LucideProps) {
  return <ChevronRight size={iconSizeMd} strokeWidth={2} {...hidden} {...props} />;
}
