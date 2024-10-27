export enum OP {
    /**No Operation- Proceed to the Next Operation */
    BLANK = 0o000,
    /** Load Multiplier - Quotient Register */
    LM = 0o004,
    /** Transfer Negative to the Left */
    TNL = 0o001,
    /** Transfer Negative to the Right */
    TNR = 0o005,
    /** Transfer Plus to the Left */
    TPL = 0o002,
    /** Transfer Plus to the Right */
    TPR = 0o006,
    /** Transfer Overflow to Left */
    TFL = 0o003,
    /** Transfer Overflow to Right */
    TFR = 0o007,
    /** Transfer to the Left */
    TRL = 0o010,
    /** Transfer to the Right */
    TRR = 0o014,
    /** Transfer to the Left if Switch T1 is On */
    T1L = 0o011,
    /** Transfer to the Right if Switch T1 is On */
    T1R = 0o015,
    /** Transfer to the Left if Switch T2 is On */
    T2L = 0o012,
    /** Transfer to the Right if Switch T2 is On */
    T2R = 0o016,
    /** Transfer to the Left if Switch T3 is On */
    T3L = 0o013,
    /** Transfer to the Right if Switch T3 is On */
    T3R = 0o017,
    /** Reset Add */
    RA = 0o020,
    /** Reset Subtract */
    RS = 0o021,
    /** Reset Add Absolute Value */
    RAV = 0o022,
    /** Reset Subtract Absolute Value */
    RSV = 0o023,
    /** Add */
    A = 0o024,
    /** Subtract */
    S = 0o025,
    /** Add Absolute Value */
    AV = 0o026,
    /** Subtract Absolute Value */
    SV = 0o027,
    /** Multiply Round - Multiply and Add Plus "One-Half" */
    MR = 0o030,
    /** Multiply Negatively and Round */
    MNR = 0o031,
    /** Multiply */
    M = 0o032,
    /** Multiply Negatively */
    MN = 0o033,
    /** Multiply and Accumulate */
    MA = 0o036,
    /** Multiply Negatively and Accumulate */
    MNA = 0o037,
    /** Multiply - Both Round and Accumulate */
    MB = 0o034,
    /** Multiply Negatively - Both Round and Accumulate */
    MNB = 0o035,
    /** Divide with Short Dividend */
    DS = 0o040,
    /** Divide Negatively with Short Dividend */
    DNS = 0o041,
    /** Divide */
    D = 0o044,
    /** Divide Negatively */
    DN = 0o045,
    /** Store Full Word */
    ST = 0o050,
    /** Store Left Operation */
    SOL = 0o051,
    /** Store Left "Address" */
    SAL = 0o052,
    /** Store Left Half Word */
    SHL = 0o053,
    /** Store Both Addresses */
    SAB = 0o054,
    /** Store Right "Operation" */
    SOR = 0o055,
    /** Store Right Address */
    SAR = 0o056,
    /** Store Right Half Word */
    SHR = 0o057,
    /** Reset Add the word in MQ into A and store the result in the specified location */
    STQ = 0o060,
    /** Reset Subtract the word in MQ into A and store the result in the specified location */
    SNQ = 0o061,
    /** Reset Add the Absolute Value of the word in MQ into A and store the result in the specified location */
    SVQ = 0o062,
    /** Reset Subtract the Absolute Value of the word in MQ into A and store the result in the specified location */
    SNV = 0o063,
    /** Add the word in MQ to the word in A and store the result in the specified location */
    AQS = 0o064,
    /** Subtract the word in MQ from the word in A and store the result in the specified location */
    SQS = 0o065,
    /** Add the absolute value of the word in MQ to the word in A and store the result in the specified location */
    AVS = 0o066,
    /** Subtract the absolute value of the word in MQ from the word in A and store the result in the specified location */
    SVS = 0o067,
    /** Accumulator to the Right - Short Right */
    SRC = 0o070,
    /** Accumulator to the Right - Short Right - No Clear MQ */
    SRH = 0o074,
    /** Long Circular Shift to the Left */
    CLC = 0o071,
    /** Long Circular Shift to the Left - No Clear MQ */
    CLH = 0o075,
    /** Long Right Power Shift */
    LRC = 0o072,
    /** Long Right Power Shift - No Clear MQ */
    LRH = 0o076,
    /** Long Left Power Shift */
    LLC = 0o073,
    /** Long Left Power Shift - No Clear MQ */
    LLH = 0o077,
    /** Select Input or Output Device */
    SEL = 0o100,
    /** Copy Operation */
    C = 0o101,
    /** Display */
    DIS = 0o104,
    /** Hoot */
    HUT = 0o105,
    /** Eject the Page of the ANelex Printer */
    EJ = 0o106,
    /** Read the clock to the accumulator */
    CLK = 0o107,
    /** Read a Block of Data from the Drum to the Store */
    RD = 0o110,
    /** Write a Block of Data from the Store on the Drum */
    WD = 0o111,
    /** Positive Intersection */
    PI = 0o124,
    /** Negative Intersection */
    NI = 0o125,
    /** Conditional Positive Intersection */
    PMI = 0o126,
    /** Conditional Negative Intersection */
    NMI = 0o127,
    /** Unconditional Halt and Transfer Left */
    HTL = 0o130,
    /** Unconditional Halt and Transfer Right */
    HTR = 0o134,
    /** Halt Conditioned by Switch H1 and Transfer Left */
    H1L = 0o131,
    /** Halt Conditioned by Switch H1 and Transfer Right */
    H1R = 0o135,
    /** Halt Conditioned by Switch H2 and Transfer Left */
    H2L = 0o132,
    /** Halt Conditioned by Switch H2 and Transfer Right */
    H2R = 0o136,
    /** Halt Conditioned by Switch H3 and Transfer Left */
    H3L = 0o133,
    /** Halt Conditioned by Switch H3 and Transfer Right */
    H3R = 0o137,

    /** Write line buffer number Ac from memory block starting at address M */
    WRITE_LINE_BUFFER = 0o140,
    /** Read line buffer number Ac into memory block starting at address M */
    READ_LINE_BUFFER = 0o141,
    /** Write SCR #At from Ab, Ac through mask in M */
    WRITE_SCR = 0o142,
    /** Read SCR #At into Ab, Ac */
    READ_SCR = 0o143,
    /** Search all SCRs for Match with Ab,Ac bits designated by the mask in cell M */
    MATCH_SCR = 0o144,
    /** Search all SCRs for Mismatch with Ab,Ac bits designated by the mask in cell M */
    MISMATCH_SCR = 0o145,

    /** Not a real mnemonic but has the effect of clearing the accumulator */
    CLEAR1 = 0o120,
    /** Not a real mnemonic but has the effect of clearing the accumulator */
    CLEAR2 = 0o121,
    /** Not a real mnemonic but has the effect of clearing the accumulator */
    CLEAR3 = 0o122,
    /** Not a real mnemonic but has the effect of clearing the accumulator */
    CLEAR4 = 0o123,
}