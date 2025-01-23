import pkg from "@solana/web3.js";
const { Keypair, Transaction, Connection, SystemProgram } = pkg;

const sendBalanceToUser = async (balance, pubKey) => {
  try {
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/5pNLaxwfuYHHlgvFr1-EqCk1V4kzvOTw"
    );

    const privateKeyArray = process.env.PRIVATE_KEY;
    const privateKeyBuffer = Uint8Array.from(privateKeyArray);
    const from = Keypair.fromSecretKey(privateKeyBuffer);

    const lamportsToSend = Math.floor(balance * 1000000000);

    const fromBalance = await connection.getBalance(from.publicKey);
    if (fromBalance < lamportsToSend + 5000) {
      throw new Error("Insufficient funds for transfer and fees.");
    }

    if (!PublicKey.isOnCurve(pubKey)) {
      throw new Error("Invalid recipient public key.");
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(pubKey),
        lamports: lamportsToSend,
      })
    );

    const signature = await connection.sendAndConfirmTransaction(transaction, [
      from,
    ]);

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
