import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";
import { BriefcaseIcon } from "@basic-ui/icons";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Alert>;
export default meta;

type Story = StoryObj<typeof Alert>;

export const AllSeverities: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" description="This is an info alert." />
      <Alert severity="success" description="This is a success alert." />
      <Alert severity="warning" description="This is a warning alert." />
      <Alert severity="error" description="This is an error alert." />
    </div>
  ),
};

export const Borderless: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" description="This is an info alert." borderless />
      <Alert severity="success" description="This is a success alert." borderless />
      <Alert severity="warning" description="This is a warning alert." borderless />
      <Alert severity="error" description="This is an error alert." borderless />
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" title="Info Alert" description="This is an info alert." />
      <Alert severity="success" title="Success Alert" description="This is a success alert." />
      <Alert severity="warning" title="Warning Alert" description="This is a warning alert." />
      <Alert severity="error" title="Error Alert" description="This is an error alert." />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert
        severity="info"
        title="Info Alert"
        description="This is an info alert."
        icon={<BriefcaseIcon />}
      />
      <Alert
        severity="success"
        title="Success Alert"
        description="This is a success alert."
        icon={<BriefcaseIcon />}
      />
      <Alert
        severity="warning"
        title="Warning Alert"
        description="This is a warning alert."
        icon={<BriefcaseIcon />}
      />
      <Alert
        severity="error"
        title="Error Alert"
        description="This is an error alert."
        icon={<BriefcaseIcon />}
      />
    </div>
  ),
};
