import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button.js';

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Report Maintenance Issue',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel / Back',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Report',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Submitting Report...',
  },
};

export const FullWidthMobile: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Submit Maintenance Ticket (360px viewport)',
  },
};
