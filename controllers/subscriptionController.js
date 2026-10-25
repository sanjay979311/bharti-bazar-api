
import Subscription from "../models/subscriptionModel.js";
import User from "../models/user.js";
import { generatePaymentId } from "../utiles/generatePaymentId.js";



export const subscribePlan  = async (req,res) =>{
    try{
        
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}




export const assignPlanByAdmin = async (req, res) => {
  try {
    const { userId, planId, startDate, endDate } = req.body;

    // Validation
    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "userId and planId are required",
      });
    }

    const paymentId = generatePaymentId();

    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      paymentId,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      paymentStatus: "Paid",
      assignedByAdmin: true,
    });

    // Attach subscription to user
    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id,
    });

    res.status(201).json({
      success: true,
      message: "Plan assigned successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const assignPlanToUser = async (req, res) => {
  try {
    const { userId, planId, assignedByAdmin = true } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Prevent multiple active subscriptions
    const activeSubscription = await Subscription.findOne({
      user: userId,
      endDate: { $gte: new Date() },
    });

    if (activeSubscription) {
      return res.status(400).json({
        message: "User already has an active subscription",
      });
    }
 const paymentId = generatePaymentId();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      paymentId,
      startDate,
      endDate,
      paymentStatus: assignedByAdmin ? "Paid" : "Pending",
      assignedByAdmin,
    });

    user.subscription = subscription._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Subscription assigned successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate({
        path: "user",
        select: "fullName email mobileNo",
      })
      .populate({
        path: "plan",
        select: "planName price durationDays",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expecting { status: "Paid" } etc.

    // Validate status
    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
      });
    }

    // Find payment and update
    const payment = await Subscription.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true } // return updated document
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}`,
      data: payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed values
    const allowedStatuses = ["inactive", "active", "expired", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription status",
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { subscriptionStatus: status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Subscription status updated to ${status}`,
      data: subscription,
    });
  } catch (error) {
    console.error("Update subscription status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUserSubscription2 = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate({
        path: "user",
        select: "fullName email mobileNo",
      })
      .populate({
        path: "plan",
        select: "planName price durationDays",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({ _id: userId })
      .populate("user", "fullName email")
      .populate("plan")
      .sort({ createdAt: -1 }); // latest membership
console.log("subscription =======>",subscription)
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No membership found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("getUserSubscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// export const getUserSubscription  = async (req,res) =>{
//     try{
        
//     }catch(error){
//         res.status(500).json({ message: error.message });
//     }
// }


export const deleteSubscription = async (req, res) => {
    try {
        const deletedItem = await Subscription.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Error deleting Subscription:', error);
        res.status(500).json({ error: 'Failed to delete Subscription' });
    }
};

