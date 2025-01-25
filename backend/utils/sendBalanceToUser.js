import pkg from "@solana/web3.js";
const { Keypair, Transaction, Connection, SystemProgram } = pkg;
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const sendBalanceToUser = async (balance, pubKey) => {
  try {
    const connection = new Connection(process.env.CONNECTION_URL);

    const from = getKeypairFromEnvironment("SECRET_KEY");
    const lamportsToSend = Math.floor(balance * 1000000000);

    const fromBalance = await connection.getBalance(from.publicKey);
    if (fromBalance < lamportsToSend + 5000) {
      throw new Error("Insufficient funds for transfer and fees.");
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: pubKey,
        lamports: lamportsToSend,
      })
    );

    const signature = await connection.sendTransaction(transaction, [from]);

    console.log("Transaction successful:", signature);
    return signature;
  } catch (error) {
    console.error("Withdrawal error:", {
      message: error.message,
      stack: error.stack,
      details: { balance, pubKey },
    });
    throw error;
  }
};

export default sendBalanceToUser;
