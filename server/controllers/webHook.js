import Stripe from "stripe";
import Transaction from "../models/transaction.js";
import User from '../models/user.js'

export const stripeWebHooks = async (req, res) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers['stripe-signature']

    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.log("SIGNATURE ERROR:", error.message)
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    try {

        switch (event.type) {

            case "checkout.session.completed": {

                const session = event.data.object

                console.log("CHECKOUT SESSION:", session.id)
                console.log("METADATA:", session.metadata)

                const { transactionId, appId } = session.metadata

                if (appId !== "QuickGPT") {
                    console.log("Invalid app")
                    break
                }

                const transaction = await Transaction.findOne({
                    _id: transactionId,
                    isPaid: false
                })

                if (!transaction) {
                    console.log("Transaction not found or already paid")
                    break
                }

                // Add credits
                await User.updateOne(
                    { _id: transaction.userId },
                    {
                        $inc: {
                            credits: transaction.credits
                        }
                    }
                )

                // Mark transaction as paid
                transaction.isPaid = true

                await transaction.save()

                console.log("PAYMENT SUCCESS")
                console.log("TRANSACTION UPDATED:", transaction._id)

                break
            }

            default:
                console.log("Unhandled event:", event.type)
        }

        res.json({ received: true })

    } catch (error) {

        console.error("WEBHOOK PROCESSING ERROR:", error)

        res.status(500).send("Internal Server Error")
    }
}