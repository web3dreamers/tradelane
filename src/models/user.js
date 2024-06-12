const mongoose = require('mongoose')
const personalSchema = new mongoose.Schema({
  fullName:{
    type: String,
    required: true,
  },
  profileImage:{
    type: String,
    required: true,
  },
  dateOfBirth:{
    type: String,
    required: true,
  },
  gender:{
    type: String,
    required: true,
  },
  maritalStatus:{
    type: String,
    required: true,
  },
  nationality:{
    type: String,
    required: true,
  },
  socialsecuritynumber:{
    type: Number,
    required: true,
  }
});
const contactSchema = new mongoose.Schema({
  residentialAddress:{
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  PhoneNumber:{
    type: Number,
    required: true,
  },
  preferredContactMethod:{
    type: String,
    required: true,
  }
})
const professionalSchema = new mongoose.Schema({
  Occupation:{
    type: String,
    required: true,
  },
  employerName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },  
  workAddress: {
    type: String,
    required: true,
  },  
  PhoneNumber:{
    type: Number,
    required: true,
  }
})
const financialSchema = new mongoose.Schema({
  annualIncome:{
    type: Number,
    required: true,
  },
  netWorth: {
    type: Number,
    required: true,
  },
  sourceOfIncome: {
    type: String,
    required: true,
  },  
  existingAssetsAndLiabilities: {
    type: String,
    required: true,
  },  
  investmentGoals:{
    type: String,
    required: true,
  }
})
const bankingSchema = new mongoose.Schema({
  accountNumber:{
    type: Number,
    required: true,
  },
  bankingHistory: {
    type: String,
    required: true,
  },
  preferredBankingChannels: {
    type: String,
    required: true,
  }
})
const riskTolerenceSchema = new mongoose.Schema({
  riskToleranceLevel:{
    type: String,
    required: true,
  },
  investmentExperience: {
    type: Number,
    required: true,
  },
  investmentKnowledge: {
    type: String,
    required: true,
  }
})
const legalSchema = new mongoose.Schema({
  taxIdentificationNumber:{
    type: String,
    required: true,
  },
  regulatoryComplianceInformation: {
    type: String,
    required: true,
  },
  KYCAMLComplianceDocuments: {
    type: String,
    required: true,
  }
})
const financeSchema = new mongoose.Schema({
  financialGoals:{
    type: String,
    required: true,
  }
})

const preferInvstProductsSchema = new mongoose.Schema({
  investmentPreference:{
    type: String,
    required: true,
  },
  investmentTimeHorizon:{
    type: String,
    required: true,
  },
  liquidityNeeds:{
    type: String,
    required: true,
  }
})
const riskAssesmentSchema = new mongoose.Schema({
  riskProfileQuestionnaireResults:{
    type: String,
    required: true,
  },
  riskCapacity:{
    type: String,
    required: true,
  }
})

const documentationSchema = new mongoose.Schema({
  copyOfIdentificationDocuments:{
    type: String,
    required: true,
  },
  proofOfAddress:{
    type: String,
    required: true,
  },
  employmentVerificationDocuments:{
    type: String,
    required: true,
  }
})
const communicationSchema = new mongoose.Schema({
  communicationFrequency:{
    type: String,
    required: true,
  },
  preferredLanguage:{
    type: String,
    required: true,
  },
  consentforEmailPhoneCommunication:{
    type: String,
    required: true,
  }
})
const techSchema = new mongoose.Schema({
  preferences:{
    type: String,
    required: true,
  },
  notificationPreferences:{
    type: String,
    required: true,
  }
})
const emergencySchema = new mongoose.Schema({
  contactName:{
    type: String,
    required: true,
  },
  relation:{
    type: String,
    required: true,
  },
  contactPhoneNumber:{
    type: Number,
    required: true,
  }
})

const estateSchema = new mongoose.Schema({
  beneficiary:{
    type: String,
    required: true,
  },
  willTestamentInformation:{
    type: String,
    required: true,
  }
})
const specialSchema = new mongoose.Schema({
  specialRequests :{
    type: String,
    required: true,
  },
  specificInvestmentRestrictions:{
    type: String,
    required: true,
  }
})
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  personalDetails:{
    _id: false,
    type: personalSchema,
    required: true,
  },
  contactInfo:{
    _id: false,
    type: contactSchema,
    required: true,
  },
  professionalInfo:{
    _id: false,
    type: professionalSchema,
    required: false,
  },
  financialInfo:{
    _id: false,
    type: financialSchema,
    required: true,
  },
  bankingInfo:{
    _id: false,
    type: bankingSchema,
    required: true,
  },
  riskTolerenceInfo:{
    _id: false,
    type: riskTolerenceSchema,
    required: true,
  },
  legalInfo:{
    _id: false,
    type: legalSchema,
    required: true,
  },
  financeGoalInfo:{
    _id: false,
    type: financeSchema,
    required: true,
  },
  preferredInvestmentProduct:{
    _id: false,
    type: preferInvstProductsSchema,
    required: true,
  },
  riskAssesmentInfo:{
    _id: false,
    type: riskAssesmentSchema,
    required: true,
  },
  documentationInfo:{
    _id: false,
    type: documentationSchema,
    required: true,
  },
  communicationInfo:{
    _id: false,
    type: communicationSchema,
    required: true,
  },
  techInfo:{
    _id: false,
    type: techSchema,
    required: true,
  },
  emergencyInfo:{
    _id: false,
    type: emergencySchema,
    required: true,
  },
  estateInfo:{
    _id: false,
    type: estateSchema,
    required: true,
  },
  specialInfo:{
    _id: false,
    type: specialSchema,
    required: true,
  },
  EMEACompliance: {
    _id: false,
    type: {
      AML: String,
      KYC: String,
      GDPR: String,
    },
    required: true,
  },
  USCompliance: {
    _id: false,
    type: {
      PatriotAct: String,
      SECRegistration: String,
      FINRA: String,
    },
    required: true,
  },
  APACCompliance: {
    _id: false,
    type: {
      AML: String,
      PersonalDataProtection: String,
      LocalRegulatory : String,
    },
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', userSchema)
