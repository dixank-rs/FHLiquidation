// Authentication and Login Form Configuration

export interface ValidationMessages {
  email: {
    required: string;
    invalid: string;
  };
  pin: {
    required: string;
    minLength: string;
  };
}

export interface FormConfig {
  fields: {
    email: {
      label: string;
      placeholder: string;
      type: string;
      required: boolean;
    };
    pin: {
      label: string;
      placeholder: string;
      type: string;
      required: boolean;
      minLength: number;
    };
  };
  submitButton: {
    text: string;
  };
  welcome: {
    title: string;
    subtitle: string;
  };
  branding: {
    companyName: string;
    copyright: string;
    poweredBy: string;
  };
}

export interface ValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
  };
  pin: {
    required: boolean;
    minLength: number;
  };
}

// Configuration objects
export const validationMessages: ValidationMessages = {
  email: {
    required: "Email is required",
    invalid: "Email is invalid"
  },
  pin: {
    required: "Pin is required",
    minLength: "Pin must be at least 4 characters"
  }
};

export const formConfig: FormConfig = {
  fields: {
    email: {
      label: "Email*",
      placeholder: "superadmin@fhl.com",
      type: "email",
      required: true
    },
    pin: {
      label: "Pin*",
      placeholder: "",
      type: "password",
      required: true,
      minLength: 4
    }
  },
  submitButton: {
    text: "Login"
  },
  welcome: {
    title: "Welcome back!",
    subtitle: "Login to continue"
  },
  branding: {
    companyName: "FHLIQUIDATION",
    copyright: "Copyright © 2026 FH Liquidation Auction Tool",
    poweredBy: "Powered by Navam Tech"
  }
};

export const validationRules: ValidationRules = {
  email: {
    required: true,
    pattern: /\S+@\S+\.\S+/
  },
  pin: {
    required: true,
    minLength: 4
  }
};

// Export default config for easy import
export default {
  validationMessages,
  formConfig,
  validationRules
};
