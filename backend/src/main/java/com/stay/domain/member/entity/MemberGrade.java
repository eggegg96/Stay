package com.stay.domain.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 회원 등급 Enum
 *
 * - BASIC: 0-2회 이용, 할인 없음
 * - ELITE: 3-6회 이용, 3% 할인
 * - ELITE_PLUS: 7회 이상, 5% 할인
 */
@Getter
@RequiredArgsConstructor
public enum MemberGrade {

    BASIC("Basic", 0, 2, 0.0, 2000),
    ELITE("Elite", 3, 6, 0.03, 3000),
    ELITE_PLUS("Elite+", 7, Integer.MAX_VALUE, 0.05, 5000);

    private final String displayName;
    private final int minReservations;      // 최소 예약 횟수
    private final int maxReservations;      // 최대 예약 횟수
    private final double discountRate;      // 할인율 (0.03 = 3%)
    private final int maxReviewPoints;      // 리뷰 작성 시 최대 포인트

    /**
     * 예약 횟수에 따른 등급 결정
     */
    public static MemberGrade determineGrade(int reservationCount) {
        if (reservationCount >= ELITE_PLUS.minReservations) {
            return ELITE_PLUS;
        } else if (reservationCount >= ELITE.minReservations) {
            return ELITE;
        } else {
            return BASIC;
        }
    }

    /**
     * 할인 금액 계산
     */
    public int calculateDiscount(int originalPrice) {
        if (originalPrice < 0) {
            throw new IllegalArgumentException("가격은 0 이상이어야 합니다.");
        }
        return (int) (originalPrice * this.discountRate);
    }

    /**
     * 할인 적용된 최종 금액 계산
     */
    public int calculateFinalPrice(int originalPrice) {
        return originalPrice - calculateDiscount(originalPrice);
    }

    /**
     * 다음 등급까지 필요한 예약 횟수
     */
    public int reservationsNeededForNextGrade(int currentReservationCount) {
        MemberGrade nextGrade = getNextGrade();
        if (nextGrade == null) {
            return 0; // 이미 최고 등급
        }
        return Math.max(0, nextGrade.minReservations - currentReservationCount);
    }

    /**
     * 다음 등급 조회
     */
    public MemberGrade getNextGrade() {
        switch (this) {
            case BASIC:
                return ELITE;
            case ELITE:
                return ELITE_PLUS;
            case ELITE_PLUS:
                return null; // 최고 등급
            default:
                return null;
        }
    }

    /**
     * 특정 등급 이상인지 체크
     */
    public boolean isGradeOrHigher(MemberGrade targetGrade) {
        return this.minReservations >= targetGrade.minReservations;
    }

    /**
     * Elite 이상 등급 여부
     */
    public boolean isEliteOrHigher() {
        return this == ELITE || this == ELITE_PLUS;
    }
}