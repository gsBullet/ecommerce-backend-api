const express = require("express");
const PromoCodeController = require("../../controllers/PromoCodeController");
const router = express.Router();

router.post("/promo-code/add-promo-code", PromoCodeController.createPromoCode);

router.post(
  "/promo-code/update-promo-code/:promoCodeId",
  PromoCodeController.updatePromoCode
);

router.get(
  "/promo-code/delete-promo-code/:promoCodeId",
  PromoCodeController.deletePromoCode
);

router.get(
  "/promo-code/get-all-promo-code",
  PromoCodeController.getAllPromoCodeList
);
router.get(
  "/category/all-category-for-discount",
  PromoCodeController.getAllCategoryForPromoCode
);
router.get(
  "/product/all-products-for-discount",
  PromoCodeController.getAllProductsForPromoCode
);
router.get(
  "/general-users/discount-for-users",
  PromoCodeController.getAllUsersForDiscount
);

module.exports = () => router;
