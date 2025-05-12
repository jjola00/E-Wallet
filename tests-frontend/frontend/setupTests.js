global.Web3 = jest.fn().mockImplementation(() => ({
    eth: {
      Contract: jest.fn().mockReturnValue({
        methods: {
          TICKET_PRICE: jest.fn().mockReturnValue({ call: jest.fn().mockResolvedValue("10000000000000000") }),
          checkBalance: jest.fn().mockReturnValue({ call: jest.fn().mockResolvedValue("1000000000000000000") }),
          buyTickets: jest.fn().mockReturnValue({
            estimateGas: jest.fn().mockResolvedValue("21000"),
            send: jest.fn().mockResolvedValue({ transactionHash: "0x123" })
          }),
          transferTickets: jest.fn().mockReturnValue({ send: jest.fn().mockResolvedValue({}) }),
          transferToVendor: jest.fn().mockReturnValue({ send: jest.fn().mockResolvedValue({}) })
        }
      }),
      getAccounts: jest.fn().mockResolvedValue(["0x123"]),
      getChainId: jest.fn().mockResolvedValue(11155111),
      getBalance: jest.fn().mockResolvedValue("1000000000000000000")
    },
    utils: {
      fromWei: jest.fn().mockImplementation((value) => parseInt(value) / 1e18),
      toWei: jest.fn().mockImplementation((value) => parseInt(value) * 1e18),
      isAddress: jest.fn().mockReturnValue(true)
    }
  }));