"use client";

import { useState } from "react";

import { appointmentSchema } from "@/lib/validations/appointment";
import { BOOKING_STEPS } from "@/features/booking/lib/bookingSteps";

import type { BookingStep } from "@/types";

export type BookingDraft = {
  barberId: string | null;
  serviceId: string | null;
  startsAt: string | null;
  customerName: string;
  customerPhone: string;
};

const INITIAL_DRAFT: BookingDraft = {
  barberId: null,
  serviceId: null,
  startsAt: null,
  customerName: "",
  customerPhone: ""
};

export function useBooking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("barber");
  const [draft, setDraft] = useState<BookingDraft>(INITIAL_DRAFT);

  function selectBarber(barberId: string) {
    setDraft((prev) => ({ ...prev, barberId }));
  }

  function selectService(serviceId: string) {
    setDraft((prev) => ({ ...prev, serviceId }));
  }

  function selectDateTime(startsAt: string) {
    setDraft((prev) => ({ ...prev, startsAt }));
  }

  function setCustomer(customer: Pick<BookingDraft, "customerName" | "customerPhone">) {
    setDraft((prev) => ({ ...prev, ...customer }));
  }

  function getStepErrors(step: BookingStep = currentStep): Record<string, string> {
    if (step === "confirmation") {
      const result = appointmentSchema.safeParse({
        barberId: draft.barberId,
        serviceId: draft.serviceId,
        startsAt: draft.startsAt,
        customerName: draft.customerName,
        customerPhone: draft.customerPhone
      });

      if (!result.success) {
        const errors: Record<string, string> = {};

        for (const issue of result.error.issues) {
          const key = typeof issue.path[0] === "string" ? issue.path[0] : "form";
          errors[key] = issue.message;
        }

        return errors;
      }

      return {};
    }

    return {};
  }

  function canProceed(step: BookingStep = currentStep): boolean {
    switch (step) {
      case "barber":
        return Boolean(draft.barberId);
      case "service":
        return Boolean(draft.serviceId);
      case "datetime":
        return Boolean(draft.startsAt);
      case "confirmation":
        return Object.values(getStepErrors("confirmation")).length === 0;
    }
  }

  function goToNextStep() {
    if (!canProceed()) {
      return;
    }

    const currentIndex = BOOKING_STEPS.indexOf(currentStep);
    const nextStep = BOOKING_STEPS[currentIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }

  function goToPreviousStep() {
    const currentIndex = BOOKING_STEPS.indexOf(currentStep);
    const previousStep = BOOKING_STEPS[currentIndex - 1];

    if (previousStep) {
      setCurrentStep(previousStep);
    }
  }

  function resetBooking() {
    setDraft(INITIAL_DRAFT);
    setCurrentStep("barber");
  }

  return {
    currentStep,
    draft,
    selectBarber,
    selectService,
    selectDateTime,
    setCustomer,
    getStepErrors,
    canProceed,
    goToNextStep,
    goToPreviousStep,
    resetBooking
  };
}