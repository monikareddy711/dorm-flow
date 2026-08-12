import type { Preview } from '@storybook/react';
import '@dormflow/design-tokens/src/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (360px)',
          styles: { width: '360px', height: '640px' },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop (1024px)',
          styles: { width: '1024px', height: '768px' },
        },
      },
    },
  },
};

export default preview;
