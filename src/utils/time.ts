function isTimeAhead(inputTime: string): boolean {
  // Get current time
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Parse input time
  const [inputHours, inputMinutes] = inputTime.split(":").map(Number);

  // Validate input format
  if (isNaN(inputHours) || isNaN(inputMinutes)) {
    throw new Error("Invalid time format. Expected HH:MM");
  }

  if (
    inputHours < 0 ||
    inputHours > 23 ||
    inputMinutes < 0 ||
    inputMinutes > 59
  ) {
    throw new Error(
      "Invalid time values. Hours must be 0-23, minutes must be 0-59",
    );
  }

  // Compare times
  if (inputHours > currentHours) {
    return true;
  } else if (inputHours === currentHours) {
    return inputMinutes > currentMinutes;
  } else {
    return false;
  }
}

// Alternative version that returns a validation object with message
export function validateTimeAhead(inputTime: string): {
  type: number;
  isValid: boolean;
  message: string;
} {
  try {
    const now = new Date();
    const currentTimeFormatted = now.toTimeString().slice(0, 5);

    const [inputHours, inputMinutes] = inputTime.split(":").map(Number);

    // Input validation
    if (isNaN(inputHours) || isNaN(inputMinutes)) {
      return {
        type: 2,
        isValid: false,
        message: "Invalid time format. Please use HH:MM format",
      };
    }

    if (
      inputHours < 0 ||
      inputHours > 23 ||
      inputMinutes < 0 ||
      inputMinutes > 59
    ) {
      return {
        type: 2,
        isValid: false,
        message: "Invalid time values. Hours: 0-23, Minutes: 0-59",
      };
    }

    const isAhead = isTimeAhead(inputTime);

    return {
      type: 2,
      isValid: isAhead,
      message: isAhead
        ? "Time is valid"
        : `Time must be ahead of current time (${currentTimeFormatted})`,
    };
  } catch {
    return {
      type: 2,
      isValid: false,
      message: "Invalid time format",
    };
  }
}
