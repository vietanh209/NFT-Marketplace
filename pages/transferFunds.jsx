import React, { useContext, useEffect, useState } from "react";
// react icon
import { FaEthereum } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { IoMdClock } from "react-icons/io";
// react ui
import {
  Textarea,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";

import Style from "../components/accountPage/Form/Form.module.css";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
// theme
import ThemeSwitcherText from "../components/theme/ThemeSwitcherText";

const TransferFunds = () => {
  const {
    currentAccount,
    transferEther,
    accountBalance,
    loading,
    transaction,
    transactionCount,
    getAllTransactions,
  } = useContext(NFTMarketplaceContext);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [message, setMessage] = useState("");
  const [readMess, setReadMess] = useState("");
  const [openBox, setOpenBox] = useState(false);
  const [value, setValue] = React.useState(new Set([]));
  const tokens = [
    { key: "SHIBA", label: "SHIBA" },
    { key: "BTC", label: "BTC" },
    { key: "ETH", label: "ETH" },
    { key: "DOG", label: "DOG" },
    { key: "KU", label: "KU" },
  ];
  
  // Tính tổng số ETH đã gửi đi
  const [totalSent, setTotalSent] = useState(0);
  // Tính tổng số ETH đã nhận
  const [totalReceived, setTotalReceived] = useState(0);
  // Lấy giao dịch gần nhất
  const [lastTransaction, setLastTransaction] = useState(null);
  // Lấy giao dịch đầu tiên
  const [firstTransaction, setFirstTransaction] = useState(null);
  
  useEffect(() => {
    getAllTransactions();
  }, []);
  
  // Tính toán số liệu thống kê từ các giao dịch
  useEffect(() => {
    if (transaction && transaction.length > 0) {
      // Tính tổng ETH đã gửi
      let sent = 0;
      // Tính tổng ETH đã nhận
      let received = 0;
      
      transaction.forEach(tx => {
        if (tx.addressFrom && tx.addressFrom.toLowerCase() === currentAccount?.toLowerCase()) {
          sent += parseFloat(tx.amount);
        }
        if (tx.addressTo && tx.addressTo.toLowerCase() === currentAccount?.toLowerCase()) {
          received += parseFloat(tx.amount);
        }
      });
      
      setTotalSent(sent.toFixed(4));
      setTotalReceived(received.toFixed(4));
      
      // Lấy giao dịch gần nhất và đầu tiên
      const sortedTransactions = [...transaction].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      if (sortedTransactions.length > 0) {
        setLastTransaction(sortedTransactions[0]);
        setFirstTransaction(sortedTransactions[sortedTransactions.length - 1]);
      }
    }
  }, [transaction, currentAccount]);
  
  // Refresh transaction history periodically
  useEffect(() => {
    const interval = setInterval(() => {
      getAllTransactions();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [getAllTransactions]);
  
  const copyAddressAccount = () => {
    const copyText = document.getElementById("yourAddress");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };
  const [showCheck, setShowCheck] = useState(false);

  const handleMouseDown = () => {
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 700);
  };
  const copyAddressSend = () => {
    const copyText = document.getElementById("sendAddress");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };
  const [showCheckSend, setShowCheckSend] = useState(false);

  const handleMouseDownSend = () => {
    setShowCheckSend(true);
    setTimeout(() => {
      setShowCheckSend(false);
    }, 700);
  };
  
  const handleTransfer = async () => {
    try {
      if (!transferAccount || !transferAmount) {
        alert("Please fill in all required fields");
        return;
      }
      
      if (!transferAccount.startsWith('0x') || transferAccount.length !== 42) {
        alert("Invalid Ethereum address format. Address must start with '0x' and be 42 characters long");
        return;
      }
      
      if (isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
      }
      
      if (parseFloat(transferAmount) > parseFloat(accountBalance)) {
        alert("Insufficient funds. Your balance is " + accountBalance + " ETH");
        return;
      }
      
      await transferEther(transferAccount, transferAmount, message);
      setTransferAmount("");
      setMessage("");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed: " + (error.message || "Unknown error"));
    }
  };
  
  // Format date to relative time (e.g. "2 hours ago")
  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    
    return dateString; // Fallback to original date
  };
  
  return (
    <ThemeSwitcherText>
      <div className="mt-10 mb-52">
        <div className="my-auto">
          <div className="flex justify-around sm:flex-col md:flex-row max-sm:flex-col max-sm:gap-5">
            <div className="w-1/3 md:w-[45%] sm:w-[90%] max-sm:w-[95%] mx-auto h-max shadow-md p-4 border border-bordercustom rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">
                Transfer your ether
              </h2>
              <div className="bg-itembackground flex border border-bordercustom rounded-xl mb-4">
                <div className="flex flex-col justify-between w-full">
                  <input
                    type="text"
                    value={currentAccount}
                    id="yourAddress"
                    hidden
                  />
                  <input
                    type="text"
                    value={transferAccount}
                    id="sendAddress"
                    hidden
                  />
                  <div className="flex xl:flex-row max-sm:flex-col md:flex-col ">
                    <p
                      className="flex items-center text-1xl font-semibold p-5 cursor-pointer"
                      onClick={() => copyAddressAccount()}
                      onMouseDown={handleMouseDown}
                    >
                      From:&nbsp;&nbsp;
                      {currentAccount && currentAccount.length > 10
                        ? currentAccount.slice(0, 7) +
                          "..." +
                          currentAccount.slice(-3)
                        : currentAccount}
                      &nbsp;&nbsp;
                      <span className="flex ml-1">
                        {showCheck ? <FaRegCheckCircle className="text-green-500"/> : <FiCopy />}
                      </span>
                    </p>
                    <p
                      className="flex items-center text-1xl font-semibold p-5 cursor-pointer"
                      onClick={() => copyAddressSend()}
                      onMouseDown={handleMouseDownSend}
                    >
                      To:&nbsp;&nbsp;
                      {transferAccount && transferAccount.length > 10
                        ? transferAccount.slice(0, 7) +
                          "..." +
                          transferAccount.slice(-3)
                        : transferAccount}
                      &nbsp;&nbsp;
                      <span className="flex ml-1">
                        {showCheckSend ? <FaRegCheckCircle className="text-green-500"/> : <FiCopy />}
                      </span>
                    </p>
                  </div>
                  <p className="flex items-center text-1xl font-semibold p-5">
                    Your balance: {accountBalance} ETH
                  </p>
                </div>
              </div>
              <form>
                <label className="text-1xl mb-2 block mt-2" htmlFor="Ether">
                  Receive Address
                </label>
                <Input
                  type="text"
                  placeholder="0x..."
                  labelPlacement="outside"
                  value={transferAccount}
                  onChange={(e) => setTransferAccount(e.target.value)}
                  className="mb-4"
                />
                <label className="text-1xl mb-2 block mt-2" htmlFor="Ether">
                  Your Price
                </label>
                <Input
                  placeholder="0.00"
                  labelPlacement="outside"
                  min={0.05}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mb-4"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  endContent={
                    <div className="flex items-center">
                      <label className="sr-only" htmlFor="currency">
                        Currency
                      </label>
                      <select
                        className="outline-none border-0 bg-transparent text-default-400 text-small"
                        id="currency"
                        name="currency"
                      >
                        <option>ETH</option>
                        <option>BSC</option>
                        <option>USD</option>
                      </select>
                    </div>
                  }
                  type="number"
                />
                <div className="mt-2 mb-4">
                  <Textarea
                    isInvalid={false}
                    variant="bordered"
                    label="Description"
                    placeholder="Enter your description"
                    labelPlacement="outside"
                    className="max-w text-primary"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="my-4">
                  <Button
                    variant="bordered"
                    color="primary"
                    onClick={handleTransfer}
                    isLoading={loading}
                    className="w-full"
                  >
                    {loading ? "Processing..." : "Transfer your balance"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="w-[60%] md:w-[50%] sm:w-[90%] max-sm:w-[90%] flex flex-col gap-4 mx-auto">
              <div className="bg-itembackground flex xl:flex-row md:flex-col max-sm:flex-col justify-between gap-5 border border-bordercustom rounded-xl p-5 shadow-md">
                <div className="min-w-[300px] flex flex-col gap-3">
                  <h3 className="text-gray-700 font-medium font-semibold">
                    Overview
                  </h3>
                  <div>
                    <p className="text-gray-400 font-thin text-sm">
                      ETH BALANCE
                    </p>
                    <p className="flex items-center text-black-600 text-sm">
                      <FaEthereum className="mr-1" /> {accountBalance && accountBalance.slice(0, 7)} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-thin text-sm">TOTAL ETH SENT</p>
                    <p className="flex items-center text-black-600 text-sm">
                      <FaEthereum className="mr-1" /> {totalSent} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-thin text-sm">TOTAL ETH RECEIVED</p>
                    <p className="flex items-center text-black-600 text-sm">
                      <FaEthereum className="mr-1" /> {totalReceived} ETH
                    </p>
                  </div>
                  <div>
                    <div>
                      <p className="text-gray-400 font-thin text-sm mb-2">
                        TOKEN HOLDINGS
                      </p>
                      <div className="flex items-center">
                        <div className="flex w-full max-w-xs flex-col gap-2">
                          <Select
                            label="Select token to view"
                            variant="bordered"
                            placeholder="Select a token"
                            selectedKeys={value}
                            className="max-w-xs"
                            onSelectionChange={setValue}
                            description="View your token holdings"
                          >
                            {tokens.map((token) => (
                              <SelectItem key={token.key}>
                                {token.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div className="flex rounded-md items-center p-2 m-2 bg-blue-500 text-white cursor-pointer">
                          <IoWalletOutline className="text-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-w-[300px] flex flex-col gap-3">
                  <h3 className="text-gray-700 font-medium font-semibold">
                    More Info
                  </h3>
                  <div>
                    <p className="text-gray-400 font-thin text-sm pb-2 flex items-center">
                      PRIVATE NAME TAGS
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 rounded px-1">Đặt tên cho các địa chỉ</span>
                    </p>
                    <Button
                      color="primary"
                      variant="light"
                      size="sm"
                      className="border rounded-2xl"
                      title="Thêm tên cho các địa chỉ để dễ nhận biết"
                    >
                      <FaPlus className="mr-1" /> Add
                    </Button>
                  </div>
                  <div>
                    <p className="text-gray-400 font-thin text-sm p-1">
                      LAST TXN SENT
                    </p>
                    <p className="flex items-center">
                      <span className="text-blue-600">
                        {lastTransaction ? (
                          <>
                            {lastTransaction.addressTo.slice(0, 10)}...{lastTransaction.addressTo.slice(-4)}
                          </>
                        ) : (
                          "No transactions"
                        )}
                      </span>{" "}
                      {lastTransaction && getRelativeTime(lastTransaction.timestamp)}
                    </p>
                  </div>
                  <div>
                    <div>
                      <p className="text-gray-400 font-thin text-sm p-1">
                        FIRST TXN SENT
                      </p>
                      <p className="flex items-center">
                        <span className="text-blue-600">
                          {firstTransaction ? (
                            <>
                              {firstTransaction.addressTo.slice(0, 10)}...{firstTransaction.addressTo.slice(-4)}
                            </>
                          ) : (
                            "No transactions"
                          )}
                        </span>{" "}
                        {firstTransaction && getRelativeTime(firstTransaction.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-itembackground flex justify-between gap-5 border border-bordercustom rounded-xl p-5 shadow-md h-full">
                <div className="flex xl:flex-row md:flex-col max-sm:flex-col w-full">
                  <div className="min-w-[400px] flex flex-col gap-8">
                    <h3 className="text-gray-700 font-medium font-semibold">
                      Multichain Info
                    </h3>
                    <div>
                      <p className="text-black-400 font-thin text-sm">
                        <span className="font-medium">Total Transactions:</span> {transaction ? transaction.length : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-thin text-sm">
                        TRANSACTION SUMMARY
                      </p>
                      <p className="flex items-center text-black-600 text-sm">
                        <span className="mr-2">Sent:</span> {totalSent} ETH | <span className="mx-2">Received:</span> {totalReceived} ETH
                      </p>
                    </div>
                  </div>
                  <div className="min-w-[300px] flex flex-col gap-8">
                    <h3 className="text-gray-700 font-medium font-semibold">
                      TRANSACTIONS
                    </h3>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="mt-1">
                          <GrTransaction />
                        </div>
                        <div>
                          <p className="text-gray-400 font-thin text-sm">
                            TOTAL TRANSACTIONS
                          </p>
                          <p className="flex items-center text-black-600 text-sm">
                            {transaction ? transaction.length : 0}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 font-thin text-sm">
                          TRANSACTION VALUE
                        </p>
                        <p className="flex items-center text-black-600 text-sm">
                          {(parseFloat(totalSent) + parseFloat(totalReceived)).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-10">
                      <div className="flex gap-1">
                        <div className="mt-1">
                          <IoMdClock />
                        </div>
                        <div>
                          <p className="text-gray-400 font-thin text-sm">
                            LAST TRANSACTION
                          </p>
                          <p className="flex items-center text-black-600 text-sm">
                            {lastTransaction ? lastTransaction.timestamp : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 font-thin text-sm">
                          FIRST TRANSACTION
                        </p>
                        <p className="flex items-center text-black-600 text-sm">
                          {firstTransaction ? firstTransaction.timestamp : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* // history */}
          <h2 className="text-2xl font-semibold ml-14 my-5">
            History your transfer {transaction && transaction.length > 0 ? `(${transaction.length})` : '(0)'}
          </h2>
          <div className="w-[95%] flex justify-center items-center m-auto bg-itembackground rounded-xl border border-bordercustom shadow-md">
            <Table removeWrapper aria-label="Transaction history table" className="w-full">
              <TableHeader>
                <TableColumn>Transaction ID</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>FROM</TableColumn>
                <TableColumn>TO</TableColumn>
                <TableColumn>Timestamp</TableColumn>
                <TableColumn>MESSAGE</TableColumn>
              </TableHeader>
              <TableBody>
                {transaction && transaction.length > 0 ? (
                  transaction.map((el, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{el.amount} ETH</TableCell>
                      <TableCell>{el.addressFrom && el.addressFrom.slice(0, 6) + '...' + el.addressFrom.slice(-4)}</TableCell>
                      <TableCell>{el.addressTo && el.addressTo.slice(0, 6) + '...' + el.addressTo.slice(-4)}</TableCell>
                      <TableCell>{el.timestamp}</TableCell>
                      <TableCell>
                        <span 
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() => {
                            setReadMess(el.message);
                            setOpenBox(true);
                          }}
                        >
                          {el.message && el.message.length > 20 ? el.message.slice(0, 20) + '...' : el.message || 'No message'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>No transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {openBox && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Transaction Message</h2>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setOpenBox(false)}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700">{readMess || "No message"}</p>
                <div className="mt-4 flex justify-end">
                  <Button 
                    color="primary" 
                    variant="light"
                    onClick={() => setOpenBox(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeSwitcherText>
  );
};

export default TransferFunds;
