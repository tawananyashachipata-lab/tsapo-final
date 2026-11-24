
import express from "express";
import { prisma } from "../db.js";
import { auth } from "../middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(auth);

// Check administrator permissions

// Check administrator permissions
function requireAdmin(req, res, next) {
  if (req.user?.role?.toUpperCase() !== "ADMIN") {
    return res.status(403).json({
      error: "Access denied. Administrators only."
    });
  }

  next();
}


router.use(requireAdmin);

// GET dashboard statistics and goods
router.get("/dashboard", async (req, res) => {
  try {
    const [total, pending, approved, rejected] =
      await Promise.all([
        prisma.goods.count(),
        prisma.goods.count({
          where: { status: "PENDING" }
        }),
        prisma.goods.count({
          where: { status: "APPROVED" }
        }),
        prisma.goods.count({
          where: { status: "REJECTED" }
        })
      ]);

    const goods = await prisma.goods.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({
      statistics: {
        total,
        pending,
        approved,
        rejected
      },
      goods
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      error: "Could not load dashboard."
    });
  }
});

// APPROVE GOODS
router.patch("/goods/:id/approve", async (req, res) => {
  try {
    const goods = await prisma.goods.findUnique({
      where: { id: req.params.id }
    });

    if (!goods) {
      return res.status(404).json({
        error: "Goods not found."
      });
    }

    if (goods.status !== "PENDING") {
      return res.status(400).json({
        error: "Only pending goods can be approved."
      });
    }

    const updatedGoods = await prisma.goods.update({
      where: { id: req.params.id },
      data: {
        status: "APPROVED",
        approvedBy: req.user.id,
        approvedAt: new Date()
      }
    });

    res.json({
      message: "Goods approved successfully.",
      goods: updatedGoods
    });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({
      error: "Could not approve goods."
    });
  }
});

// REJECT GOODS
router.patch("/goods/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        error: "Please provide a rejection reason."
      });
    }

    const goods = await prisma.goods.findUnique({
      where: { id: req.params.id }
    });

    if (!goods) {
      return res.status(404).json({
        error: "Goods not found."
      });
    }

    if (goods.status !== "PENDING") {
      return res.status(400).json({
        error: "Only pending goods can be rejected."
      });
    }

    const updatedGoods = await prisma.goods.update({
      where: { id: req.params.id },
      data: {
        status: "REJECTED",
        rejectionReason: reason.trim(),
        approvedBy: req.user.id
      }
    });

    res.json({
      message: "Goods rejected successfully.",
      goods: updatedGoods
    });
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).json({
      error: "Could not reject goods."
    });
  }
});

export default router;
