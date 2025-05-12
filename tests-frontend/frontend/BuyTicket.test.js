import React from 'react';
import { render, screen } from '@testing-library/react';

// Minimal Web3 mock
global.Web3 = jest.fn().mockImplementation(() => ({
  eth: {
    Contract: jest.fn().mockReturnValue({
      methods: {
        TICKET_PRICE: jest.fn().mockReturnValue({ call: jest.fn().mockResolvedValue("10000000000000000") })
      }
    })
  }
}));

describe('BuyTicket', () => {
  it('renders without crashing', () => {
    render(<div>BuyTicket Component</div>);
    expect(screen.getByText('BuyTicket Component')).toBeInTheDocument();
  });
});