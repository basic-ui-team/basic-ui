import type { ComponentType, SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertTriangleIcon,
  BellIcon,
  BentoIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleFillIcon,
  DeleteIcon,
  DonerIcon,
  DownloadIcon,
  EditIcon,
  HamburgerIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  KebabIcon,
  LocationIcon,
  MeatballIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
  XIcon,
} from "@basic-ui/icons";
import { Icon } from "./Icon";
import { PALETTE_FAMILIES } from "../../lib/colorRecipes/colorRecipes";

type LibraryIcon = ComponentType<SVGProps<SVGSVGElement>>;

const iconGroups: { category: string; icons: [string, LibraryIcon][] }[] = [
  {
    category: "Actions",
    icons: [
      ["Delete", DeleteIcon],
      ["Download", DownloadIcon],
      ["Edit", EditIcon],
      ["Plus", PlusIcon],
    ],
  },
  {
    category: "Navigation",
    icons: [
      ["Bento", BentoIcon],
      ["Chevron down", ChevronDownIcon],
      ["Chevron left", ChevronLeftIcon],
      ["Chevron right", ChevronRightIcon],
      ["Chevron up", ChevronUpIcon],
      ["Doner", DonerIcon],
      ["Hamburger", HamburgerIcon],
      ["Home", HomeIcon],
      ["Kebab", KebabIcon],
      ["Meatball", MeatballIcon],
    ],
  },
  {
    category: "Status",
    icons: [
      ["Alert triangle", AlertTriangleIcon],
      ["Check circle", CheckCircleIcon],
      ["Help circle", HelpCircleIcon],
      ["Info", InfoIcon],
      ["X circle", XCircleIcon],
    ],
  },
  {
    category: "UI",
    icons: [
      ["Bell", BellIcon],
      ["Briefcase", BriefcaseIcon],
      ["Calendar", CalendarIcon],
      ["Chart bar", ChartBarIcon],
      ["Check", CheckIcon],
      ["Circle fill", CircleFillIcon],
      ["Location", LocationIcon],
      ["Minus", MinusIcon],
      ["Moon", MoonIcon],
      ["Settings", SettingsIcon],
      ["Sun", SunIcon],
      ["User", UserIcon],
      ["Users", UsersIcon],
      ["X", XIcon],
    ],
  },
];

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  argTypes: {
    icon: { control: false },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: {
      control: { type: "select" },
      options: ["muted", ...PALETTE_FAMILIES],
      description: "Optional semantic color. Inherits the parent's color when omitted.",
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: <CheckCircleIcon />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon icon={<BellIcon />} size={size} />
          <span className="text-sm">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(
        ["muted", ...PALETTE_FAMILIES] as const
      ).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <Icon icon={<UsersIcon />} color={color} size="lg" />
          <span className="text-sm">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const InheritedColor: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-3 rounded-lg bg-surface-base p-4 text-green-700">
        <Icon icon={<SunIcon />} size="lg" />
        <span>Inherits the parent's semantic color</span>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-gray-900 p-4 text-white">
        <Icon icon={<MoonIcon />} size="lg" />
        <span>Inherits white on a dark surface</span>
      </div>
    </div>
  ),
};

export const ResponsiveSizes: Story = {
  args: {
    icon: <BellIcon />,
    size: { base: "sm", md: "md", lg: "xl" },
    color: "sky",
  },
  parameters: {
    docs: {
      description: {
        story: "This icon scales from sm to md to xl at the base, md, and lg breakpoints.",
      },
    },
  },
};

export const CustomSvg: Story = {
  args: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    size: "xl",
    color: "muted",
  },
};

export const AccessibleMeaningfulIcon: Story = {
  args: {
    icon: <CheckCircleIcon />,
    color: "green",
    "aria-hidden": false,
    "aria-label": "Saved successfully",
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="w-full max-w-5xl space-y-8">
      {iconGroups.map(({ category, icons }) => (
        <section key={category} aria-label={`${category} icons`}>
          <h3 className="mb-4 text-lg font-semibold">{category}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {icons.map(([name, IconComponent]) => (
              <div
                key={name}
                className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-border-base p-3"
              >
                <Icon icon={<IconComponent />} size="lg" />
                <span className="text-center text-xs">{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
