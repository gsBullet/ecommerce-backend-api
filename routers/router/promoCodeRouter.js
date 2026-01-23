const express = require("express");
const PromoCodeController = require("../../controllers/PromoCodeController");
const router = express.Router();

router.post(
  "/promo-code/add-promo-code-by-admin",
  PromoCodeController.createPromoCode,
);

router.post(
  "/promo-code/update-promo-code-by-admin/:promoCodeId",
  PromoCodeController.updatePromoCode,
);
router.patch(
  "/promo-codes/change-promo-status/:promoCodeId",
  PromoCodeController.updatePromoCodeStatus,
);

router.get(
  "/promo-codes/delete-promo-code/:promoCodeId",
  PromoCodeController.deletePromoCode,
);

router.get(
  "/promo-codes/get-all-promo-codes",
  PromoCodeController.getAllPromoCodeList,
);
router.get(
  "/category/all-category-for-discount",
  PromoCodeController.getAllCategoryForPromoCode,
);
router.get(
  "/product/all-products-for-discount",
  PromoCodeController.getAllProductsForPromoCode,
);
router.get(
  "/general-users/discount-for-users",
  PromoCodeController.getAllUsersForDiscount,
);

module.exports = () => router;
