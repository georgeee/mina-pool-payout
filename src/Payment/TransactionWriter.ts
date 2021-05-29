import { PayoutTransaction } from "../core/payout-calculator";
import { ITransactionProcessor as ITransactionProcessor, PaymentProcess } from "./Model";
import { IFileWriter } from "../Shared/Model";
import { PaymentConfiguration } from "../Configuration/Model";

export class TransactionProcessor implements ITransactionProcessor {
    
  private fileWriter : IFileWriter

  constructor(fileWriter : IFileWriter) {
    this.fileWriter = fileWriter
  }
  async write(transactions: PayoutTransaction[], 
              config: PaymentConfiguration, 
              paymentProcess: PaymentProcess): Promise<void> {
        
        const runDateTime = new Date();

        const { storePayout, maximumHeight, totalPayoutFundsNeeded } = paymentProcess

        const { minimumHeight} = config
        
        const payoutTransactionsFileName = this.generateOutputFileName("payout_transactions", runDateTime, minimumHeight, maximumHeight);
    
        this.fileWriter.write(payoutTransactionsFileName, JSON.stringify(transactions))

        const payoutDetailsFileName = this.generateOutputFileName("payout_details", runDateTime, minimumHeight, maximumHeight);
        
        this.fileWriter.write(payoutDetailsFileName, JSON.stringify(storePayout))
        
        console.log(`Fund via: mina_ledger_wallet send-payment --offline --network testnet --nonce FUNDERNONCE --fee 0.1 BIP44ACCOUNT FUNDING_FROM_ADDRESS ${config.senderKeys.publicKey} ${totalPayoutFundsNeeded / 1000000000}`);
    
    }

    private generateOutputFileName (identifier: string, runDateTime: Date, minimumHeight: number, maximumHeight: number) {
        return `./src/data/${identifier}_${this.longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
    }

    private longDateString (d: Date) {
        return d.toISOString().replace(/\D/g, '')
    }

}