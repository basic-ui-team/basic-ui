import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSelect, type SelectOption, Portal } from "@basic-ui/react-utilities";
import { Box } from "../Box";
import { Flex } from "../Flex";
import { Text } from "../Text";

const fruits: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "boysenberry", label: "Boysenberry" },
  { value: "cherry", label: "Cherry" },
  { value: "cranberry", label: "Cranberry", disabled: true },
];

const meta: Meta = {
  title: "Headless/Select",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

function HeadlessSelectDemo({
  options = fruits,
  label = "Favorite Fruit",
}: {
  options?: SelectOption[];
  label?: string;
} = {}) {
  const select = useSelect({ options });
  return (
    <Flex direction="column" gap="sm" align="start">
      <Text as="span" weight="medium" {...select.labelProps}>
        {label}
      </Text>
      <Box
        as="div"
        px="sm"
        py="xs"
        className="min-w-40 cursor-pointer rounded-md border bg-white"
        {...select.comboboxProps}
      >
        {select.selectedLabel ?? "Choose a Fruit"}
      </Box>
      {select.open && (
        <Portal>
          <Box
            as="div"
            p="xs"
            className="rounded-md border bg-white shadow-md"
            {...select.listboxProps}
          >
            {options.map((option, index) => (
              <Box
                as="div"
                key={option.value}
                px="sm"
                py="xs"
                className={`rounded-sm ${
                  select.activeIndex === index ? "bg-gray-100" : ""
                } ${option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                {...select.getOptionProps(index)}
              >
                {option.label}
              </Box>
            ))}
          </Box>
        </Portal>
      )}
    </Flex>
  );
}

type Story = StoryObj;

export const Default: Story = {
  render: () => <HeadlessSelectDemo />,
};

export const WithDisabledOption: Story = {
  render: () => <HeadlessSelectDemo options={fruits} />,
};
