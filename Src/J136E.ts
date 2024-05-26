import { MemoryBuilder } from "./MemoryBuilder.js";
import { OP } from "./OP.js";

export function j136e() {
    const builder = new MemoryBuilder();
    // ID           LOCN OPN ADDR OPN ADDR     COMMENTS
    // 00000000011111111112222222222333333333344444444445555555555666666666677777777778
    // 12345678901234567890123456789012345678901234567890123456789012345678901234567890
    // J136E001        $                76
    // J136E002        P                64
    // J136E003        T                 6
    // J136E004        0 100    0 010 *  9     LINK TO BEGINNING OF LOADER.
    builder.addWord(OP.SEL, 0, OP.TRL, 76);
    // J136E005        1 100    0 004    5     J135A AS IT EXISTS IN STORAGE.
    builder.addWord(OP.SEL, 0, OP.LM, 5);
    // J136E006        2 101    3 014    3
    builder.addWord(OP.C, 3, OP.TRR, 3);
    // J136E007        3
    builder.addWordRaw(0n);
    // J136E008        4 075   79 002    2
    builder.addWord(OP.CLH, 79, OP.TPL, 2)
    // J136E009        5 010    1 000,4000
    builder.addWord(OP.TRL, 1, OP.BLANK, 0o4000);
    // J136E010        6                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E011        7                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E012        8                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E013        9                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E014       10                       BLANK COLUMN INDICATOR
    builder.addWordRaw(0n);
    // J136E015       11 100 0000 000 0000     # CELL --- ORIGIN OF DIRECTORY
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E016       12                       TEMPORARY COUNTER
    builder.addWordRaw(0n);
    // J136E017       13                       IMAGE VALUE 1
    builder.addWordRaw(0n);
    // J136E018       14                       IMAGE VALUE 2
    builder.addWordRaw(0n);
    // J136E019       15                       IMAGE VALUE 4
    builder.addWordRaw(0n);
    // J136E020       16 100 0000 000 0000     CONSTANT
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E021       17 100 0000 000 0000     A CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E022       18 100 0000 000 0000     B CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E023       19 100 0000 000 0000     C CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E024       20 100 0000 000 0000     D CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E025       21 100 0000 000 0000     E CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E026       22 100 0000 000 0000     F CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E027       23 100 0000 000 0000     G CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E028       24 100 0000 000 0000     H CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E029       25 100 0000 000 0000     I CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E030       26 000 0001 000 0000     CONSTANT
    builder.addWordRaw(0o000_0001_000_0000n);
    // J136E031       27 130    . 134    .     . CELL --- LINK TO BEGINNING OF PROGRAM
    builder.addWord(OP.HTL, 27, OP.HTR, 27)
    // J136E032       28 000    0 020 P 11     DUMMY
    builder.addWord(OP.BLANK, 0, OP.RA, 75)
    // J136E033       29                       IMAGE VALUE 8
    builder.addWordRaw(0n);
    // J136E034       30                       IMAGE VALUE 16
    builder.addWordRaw(0n);
    // J136E035       31                       IMAGE VALUE 32
    builder.addWordRaw(0n);
    // J136E036       32               544     CONSTANT    - CELL
    builder.addWordRaw(544n);
    // J136E037       33 100 0000 000 0000     J CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E038       34 100 0000 000 0000     K CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E039       35 100 0000 000 0000     L CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E040       36 100 0000 000 0000     M CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E041       37 100 0000 000 0000     N CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E042       38 100 0000 000 0000     O CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E043       39 100 0000 000 0000     P CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E044       40 100 0000 000 0000     Q CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E045       41 100 0000 000 0000     R CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E046       42                       TRANSLATOR
    builder.addWordRaw(0n);
    // J136E047       43 100 0000 000 0000     $ CELL --- COUNTER
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E048       44               400     * CELL --- ORIGIN OF SYMBOL TABLE
    builder.addWordRaw(400n);
    // J136E049       45               100     NUMBER OF SYMBOLS PERMITTED
    builder.addWordRaw(100n);
    // J136E050       46               245     ORIGIN OF FORWARD REFERENCE TABLE.
    builder.addWordRaw(245n);
    // J136E051       47               155     NUMBER OF FORWARD REFERENCES PERMITTED.
    builder.addWordRaw(155n);
    // J136E052       48                 8     CONSTANT
    builder.addWordRaw(8n);
    // J136E053       49 000    0 020 P  1     DUMMY
    builder.addWord(OP.BLANK, 0, OP.RA, 65)
    // J136E054       50 100 0000 000 0000     S CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E055       51 100 0000 000 0000     T CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E056       52 100 0000 000 0000     U CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E057       53 100 0000 000 0000     V CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E058       54 100 0000 000 0000     W CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E059       55 100 0000 000 0000     X CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E060       56 100 0000 000 0000     Y CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E061       57 100 0000 000 0000     Z CELL
    builder.addWordRaw(0o100_0000_000_0000n);
    // J136E062       58 174 0000 000 0000     CONSTANT
    builder.addWordRaw(0o174_0000_000_0000n);
    // J136E063       59 100    0 010 *  9     , CELL --- LINK TO BEGINNING OF LOADER.
    builder.addWord(OP.SEL, 0, OP.TRL, 76);
    // J136E064       60                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E065       61                       WORD BUILDUP CELL
    builder.addWordRaw(0n);
    // J136E066       62                       TEMPORARY
    builder.addWordRaw(0n);
    // J136E067       63                       CURRENT POSITION IN FWD REF TABLE.
    builder.addWordRaw(0n);
    // J136E068     P  0&           1   39     POWERS OF TEN
    builder.addWordRaw(1n);
    // J136E069     P  1&          10   39
    builder.addWordRaw(10n);
    // J136E070     P  2&         100   39
    builder.addWordRaw(100n);
    // J136E071     P  3&        1000   39
    builder.addWordRaw(1_000n);
    // J136E072     P  4&       10000   39
    builder.addWordRaw(10_000n);
    // J136E073     P  5&      100000   39
    builder.addWordRaw(100_000n);
    // J136E074     P  6&     1000000   39
    builder.addWordRaw(1_000_000n);
    // J136E075     P  7&    10000000   39
    builder.addWordRaw(10_000_000n);
    // J136E076     P  8&   100000000   39
    builder.addWordRaw(100_000_000n);
    // J136E077     P  9&  1000000000   39
    builder.addWordRaw(1_000_000_000n);
    // J136E078     P 10& 10000000000   39
    builder.addWordRaw(10_000_000_000n);
    // J136E079     P 11&100000000000   39
    builder.addWordRaw(100_000_000_000n);
    // J136E080     *  9 020   46 050   63     PRESET POSITION IN FWD REF TABLE.
    builder.addWord(OP.RA, 46, OP.ST, 63);
    // J136E081     *  1 101 T  0 101 T  1     COPY, ENCODE AND EDIT IMAGE.
    builder.addWord(OP.C, 6, OP.C, 7);
    // J136E082          004 T  0 020 T  1
    builder.addWord(OP.LM, 6, OP.RA, 7);
    // J136E083          075   12 064   29
    builder.addWord(OP.CLH, 12, OP.AQS, 29);
    // J136E084          060   13 101 T  0
    builder.addWord(OP.STQ, 13, OP.C, 6);
    // J136E085          101 T  1 004 T  0
    builder.addWord(OP.C, 7, OP.LM, 6);
    // J136E086          020 T  1 075   12
    builder.addWord(OP.RA, 7, OP.CLH, 12);
    // J136E087          064   14 020   13
    builder.addWord(OP.AQS, 14, OP.RA, 13);
    // J136E088          064   13 101 T  0
    builder.addWord(OP.AQS, 13, OP.C, 6)
    // J136E089          101 T  1 004 T  0
    builder.addWord(OP.C, 7, OP.LM, 6);
    // J136E090          020 T  1 075   12
    builder.addWord(OP.RA, 7, OP.CLH, 12);
    // J136E091          024   14 064   15
    builder.addWord(OP.A, 14, OP.AQS, 15);
    // J136E092          020   13 064   13
    builder.addWord(OP.RA, 13, OP.AQS, 13);
    // J136E093          101 T  0 101 T  1
    builder.addWord(OP.C, 6, OP.C, 7);
    // J136E094          004 T  0 020 T  1
    builder.addWord(OP.LM, 6, OP.RA, 7);
    // J136E095          075   12 024   14
    builder.addWord(OP.CLH, 12, OP.A, 14);
    // J136E096          064   14 020   13
    builder.addWord(OP.AQS, 14, OP.RA, 13);
    // J136E097          064   13 101 T  1
    builder.addWord(OP.AQS, 13, OP.C, 7);
    // J136E098          101 T  0 020 T  1
    builder.addWord(OP.C, 6, OP.RA, 7);
    // J136E099          004 T  0 075   12
    builder.addWord(OP.LM, 6, OP.CLH, 12);
    // J136E100          024   13 050   13
    builder.addWord(OP.A, 13, OP.ST, 13);
    // J136E101          021 P  0 125   13
    builder.addWord(OP.RS, 64, OP.NI, 13);
    // J136E102          125   14 125   15
    builder.addWord(OP.NI, 14, OP.NI, 15);
    // J136E103          125   29 050 T  4
    builder.addWord(OP.NI, 29, OP.ST, 10)
    // J136E104          060 T  2 125 T  4
    builder.addWord(OP.STQ, 8, OP.NI, 10);
    // J136E105          050   30 101 T  0
    builder.addWord(OP.ST, 30, OP.C, 6);
    // J136E106          101 T  1 020 T  0
    builder.addWord(OP.C, 7, OP.RA, 6);
    // J136E107          004 T  1 075   12
    builder.addWord(OP.LM, 7, OP.CLH, 12);
    // J136E108          024   30 050   31
    builder.addWord(OP.A, 30, OP.ST, 31);
    // J136E109          020   30 064   30
    builder.addWord(OP.RA, 30, OP.AQS, 30);
    // J136E110          020 T  4 125 T  2
    builder.addWord(OP.RA, 10, OP.NI, 8);
    // J136E111          125   30 125   31
    builder.addWord(OP.NI, 30, OP.NI, 31);
    // J136E112          050 T  4 071   23
    builder.addWord(OP.ST, 10, OP.CLC, 23);
    // J136E113          002 *  2 100    0     IF C36 IS BLANK, THEN READ NEXT CARD.
    builder.addWord(OP.TPL, 110, OP.SEL, 0);
    // J136E114     *  2 020 $  0 010 * 20     CONVERT LOCATION.
    builder.addWord(OP.RA, 110, OP.TRL, 178);
    // J136E115          010 *  3 060 T  0
    builder.addWord(OP.TRL, 119, OP.STQ, 6);
    // J136E116          056 * 10 056 * 11     SYMBOLIC LOCATION ROUTINE.
    builder.addWord(OP.SAR, 113, OP.SAR, 114)
    // J136E117     * 10 004    $ 020 ----
    builder.addWord(OP.LM, 43, OP.RA, 0);
    // J136E118     * 11 006 * 71 060 ----
    builder.addWord(OP.TPR, 118, OP.STQ, 0);
    // J136E119     *  4 020    $ 024 P  0     ADVANCE COUNTER.
    builder.addWord(OP.RA, 43, OP.A, 64);
    // J136E120          050   12 020    $
    builder.addWord(OP.ST, 12, OP.RA, 43);
    // J136E121          024   42 056 *  8     PREPARE TO STORE WORD.
    builder.addWord(OP.A, 42, OP.SAR, 151);
    // J136E122     * 71 010 *  5 134 $  0     HALT IF AMBIGUOUS SYMBOLIC LOCATION.
    builder.addWord(OP.TRL, 123, OP.HTR, 118);
    // J136E123     *  3 020 T  4 002 * 12
    builder.addWord(OP.RA, 10, OP.TPL, 121);
    // J136E124          025   58 002 *  4     IF BLANK LOCATION GO TO *  4.
    builder.addWord(OP.S, 58, OP.TPL, 115);
    // J136E125     * 12 020    $ 050   12     RELATIVE OR ABSOLUTE LOCATION.
    builder.addWord(OP.RA, 43, OP.ST, 12);
    // J136E126          060 T  0 056 *  8     PREPARE TO STORE WORD.
    builder.addWord(OP.STQ, 6, OP.SAR, 151);
    // J136E127     *  5 120    0 050   61     CLEAR WORD BUILDUP.
    builder.addWord(OP.CLEAR1, 0, OP.ST, 61);
    // J136E128          020 T  4 071    5
    builder.addWord(OP.RA, 10, OP.CLC, 5);
    // J136E129          002 * 80 020   26     IF C18 IS PUNCHED GO TO DATA ROUTINE.
    builder.addWord(OP.TPL, 216, OP.RA, 26);
    // J136E130     *  7 050   62 020 T  4     SET ALTERNATOR.
    builder.addWord(OP.ST, 62, OP.RA, 10);
    // J136E131          071    9 050 T  4     SHIFT BLANK COLUMN INDICATOR.
    builder.addWord(OP.CLC, 9, OP.ST, 10);
    // J136E132          020 $  0 010 * 40     DISCARD SPACE.
    builder.addWord(OP.RA, 128, OP.TRL, 204)
    // J136E133          020 $  0 010 * 40     CONVERT OPERATION.
    builder.addWord(OP.RA, 129, OP.TRL, 204);
    // J136E134          071    6 050 T  1
    builder.addWord(OP.CLC, 6, OP.ST, 7);
    // J136E135          020 $  0 010 * 40
    builder.addWord(OP.RA, 131, OP.TRL, 204);
    // J136E136          071    3 050 T  2
    builder.addWord(OP.CLC, 3, OP.ST, 8);
    // J136E137          020 $  0 010 * 40
    builder.addWord(OP.RA, 133, OP.TRL, 204);
    // J136E138          024 T  1 024 T  2
    builder.addWord(OP.A, 7, OP.A, 8);
    // J136E139          004   61 075   21
    builder.addWord(OP.LM, 61, OP.CLH, 21);
    // J136E140          074    9 064   61
    builder.addWord(OP.SRH, 9, OP.AQS, 61);
    // J136E141          020 $  0 010 * 20     CONVERT ADDRESS.
    builder.addWord(OP.RA, 137, OP.TRL, 178);
    // J136E142          010 *  6 060 T  0
    builder.addWord(OP.TRL, 148, OP.STQ, 6);
    // J136E143          056 * 13 014 * 13     SYMBOLIC ADDRESS ROUTINE.
    builder.addWord(OP.SAR, 140, OP.TRR, 140)
    // J136E144     * 13          020 ----
    builder.addWord(OP.BLANK, 0, OP.RA, 0);
    // J136E145          006 *  6 020   63
    builder.addWord(OP.TPR, 148, OP.RA, 63);
    // J136E146          025   46 025   47
    builder.addWord(OP.S, 46, OP.S, 47);
    // J136E147          001 * 15 134 $  0     HALT IF TOO MANY FORWARD REFERENCES.
    builder.addWord(OP.TNL, 144, OP.HTR, 143);
    // J136E148     * 15 020   63 056 * 14
    builder.addWord(OP.RA, 63, OP.SAR, 147);
    // J136E149          024 P  0 050   63
    builder.addWord(OP.A, 64, OP.ST, 63);
    // J136E150          020   62 024    $
    builder.addWord(OP.RA, 62, OP.A, 43);
    // J136E151     * 14 024   42 050 ----     STORE ITEM IN FWD REF TABLE.
    builder.addWord(OP.A, 42, OP.ST, 0);
    // J136E152     *  6 060 T  0 056   61     FORM INSTRUCTION.
    builder.addWord(OP.STQ, 6, OP.SAR, 61);
    // J136E153          021   62 001 *  7     IF NOT DONE GO TO *  7.
    builder.addWord(OP.RS, 62, OP.TNL, 126);
    // J136E154     * 70 020   12 050    $
    builder.addWord(OP.RA, 12, OP.ST, 43);
    // J136E155     *  8 020   61 050 ----     STORE WORD.
    builder.addWord(OP.RA, 61, OP.ST, 0);
    // J136E156          020 T  4 071    5
    builder.addWord(OP.RA, 10, OP.CLC, 5);
    // J136E157          001 *  1 010 $  1     IF C36 IS BLANK GO BACK TO *  1.
    builder.addWord(OP.TNL, 77, OP.TRL, 154);
    // J136E158          020 $  0 010 * 40
    builder.addWord(OP.RA, 154, OP.TRL, 204);
    // J136E159     * 64 056 * 16 020   63     SET SWITCH ACCORDING TO C36.
    builder.addWord(OP.SAR, 177, OP.RA, 63);
    // J136E160          025 P  0 056 * 17     SUBSTITUTE FOR FORWARD REFERENCES.
    builder.addWord(OP.S, 64, OP.SAR, 158);
    // J136E161          050   63 025   46
    builder.addWord(OP.ST, 63, OP.S, 46);
    // J136E162     * 17 005 * 18 020 ----
    builder.addWord(OP.TNR, 171, OP.RA, 0);
    // J136E163          005 * 19 056 * 60
    builder.addWord(OP.TNR, 166, OP.SAR, 160);
    // J136E164     * 60 056 * 61 020 ----
    builder.addWord(OP.SAR, 165, OP.RA, 0);
    // J136E165          072   21 056 * 62
    builder.addWord(OP.LRC, 21, OP.SAR, 162);
    // J136E166     * 62 050 T  0 020 ----
    builder.addWord(OP.ST, 6, OP.RA, 0);
    // J136E167          002 * 63 134 $  0     HALT IF UNDEFINED SYMBOL IN LEFT ADDR.
    builder.addWord(OP.TPL, 164, OP.HTR, 163);
    // J136E168     * 63 056 T  0 020 T  0
    builder.addWord(OP.SAR, 6, OP.RA, 6);
    // J136E169     * 61 077   21 050 ----
    builder.addWord(OP.LLH, 21, OP.ST, 0);
    // J136E170     * 19 014 * 64 056 * 65
    builder.addWord(OP.TRR, 155, OP.SAR, 167);
    // J136E171     * 65 056 * 66 020 ----
    builder.addWord(OP.SAR, 170, OP.RA, 0);
    // J136E172          056 * 67 014 * 67
    builder.addWord(OP.SAR, 169, OP.TRR, 169);
    // J136E173     * 67 130 $  0 020 ----     HALT IF UNDEFINED SYMBOL IN RIGHT ADDR.
    builder.addWord(OP.HTL, 169, OP.RA, 0);
    // J136E174     * 66 001 * 67 056 ----
    builder.addWord(OP.TNL, 169, OP.SAR, 0);
    // J136E175     * 18 014 * 64 004   16
    builder.addWord(OP.TRR, 155, OP.LM, 16);
    // J136E176          020    * 024   45
    builder.addWord(OP.RA, 44, OP.A, 45);
    // J136E177     * 69 014 * 68 060 ----
    builder.addWord(OP.TRR, 174, OP.STQ, 0);
    // J136E178     * 68 020 T  0 025 P  0
    builder.addWord(OP.RA, 6, OP.S, 64);
    // J136E179          056 * 69 050 T  0
    builder.addWord(OP.SAR, 173, OP.ST, 6)
    // J136E180          025    * 006 * 69
    builder.addWord(OP.S, 44, OP.TPR, 173);
    // J136E181     * 16          010 ----     , OR . BRANCH
    builder.addWord(OP.BLANK, 0, OP.TRL, 0);
    // J136E182     * 20 024   26 052 * 25     ADDRESS CONVERSION ROUTINE.
    builder.addWord(OP.A, 26, OP.SAL, 202);
    // J136E183          052 * 26 120    0
    builder.addWord(OP.SAL, 201, OP.CLEAR1, 0);
    // J136E184          050 T  1 050 T  3
    builder.addWord(OP.ST, 7, OP.ST, 9);
    // J136E185          020 $  0 010 * 40     PEEL OFF PREFIX.
    builder.addWord(OP.RA, 181, OP.TRL, 204);
    // J136E186          020 T  4 002 * 27     IF OCTAL GO TO * 27
    builder.addWord(OP.RA, 10, OP.TPL, 184);
    // J136E187          020 P  1 014 * 27
    builder.addWord(OP.RA, 65, OP.TRR, 184);
    // J136E188     * 27 020   48 050 T  2
    builder.addWord(OP.RA, 48, OP.ST, 8);
    // J136E189          020 $  0 010 * 40     CALL FOR HIGH ORDER CHARACTER
    builder.addWord(OP.RA, 185, OP.TRL, 204);
    // J136E190          056 * 21 025 P  1
    builder.addWord(OP.SAR, 187, OP.S, 65);
    // J136E191     * 21 001 * 23 020 ----
    builder.addWord(OP.TNL, 190, OP.RA, 0);
    // J136E192          002 * 22 134 $  0     HALT IF UNDEFINED REGION INDICATOR.
    builder.addWord(OP.TPL, 189, OP.HTR, 188);
    // J136E193     * 22 050 T  1 010 * 24
    builder.addWord(OP.ST, 7, OP.TRL, 191);
    // J136E194     * 23 060 T  3 010 * 24
    builder.addWord(OP.STQ, 9, OP.TRL, 191);
    // J136E195     * 24 020 $  0 010 * 40
    builder.addWord(OP.RA, 191, OP.TRL, 204);
    // J136E196          004 T  2 036 T  3
    builder.addWord(OP.LM, 8, OP.MA, 9);
    // J136E197          060 T  3 010 * 29
    builder.addWord(OP.STQ, 9, OP.TRL, 194);
    // J136E198     * 29 020 $  0 010 * 40
    builder.addWord(OP.RA, 194, OP.TRL, 204);
    // J136E199          004 T  2 036 T  3
    builder.addWord(OP.LM, 8, OP.MA, 9);
    // J136E200          060 T  3 010 * 30
    builder.addWord(OP.STQ, 9, OP.TRL, 197);
    // J136E201     * 30 020 $  0 010 * 40
    builder.addWord(OP.RA, 197, OP.TRL, 204);
    // J136E202          004 T  2 024 T  1
    builder.addWord(OP.LM, 8, OP.A, 7);
    // J136E203          036 T  3 020 * 21
    builder.addWord(OP.MA, 9, OP.RA, 187);
    // J136E204          025 * 28 006 * 26
    builder.addWord(OP.S, 203, OP.TPR, 201);
    // J136E205     * 26 010 ---- 025 P  0
    builder.addWord(OP.TRL, 0, OP.S, 64);
    // J136E206     * 25 005 ---- 010 * 26
    builder.addWord(OP.TNR, 0, OP.TRL, 201);
    // J136E207     * 28 001 * 23 020    *
    builder.addWord(OP.TNL, 190, OP.RA, 44);
    // J136E208     * 40 024   26 052 * 41     CHARACTER ROUTINE.
    builder.addWord(OP.A, 26, OP.SAL, 215);
    // J136E209          020   31 071    1
    builder.addWord(OP.RA, 31, OP.CLC, 1);
    // J136E210          050   31 020   30
    builder.addWord(OP.ST, 31, OP.RA, 30);
    // J136E211          075    1 050   30
    builder.addWord(OP.CLH, 1, OP.ST, 30);
    // J136E212          020   29 075    1
    builder.addWord(OP.RA, 29, OP.CLH, 1);
    // J136E213          050   29 020   15
    builder.addWord(OP.ST, 29, OP.RA, 15);
    // J136E214          075    1 050   15
    builder.addWord(OP.CLH, 1, OP.ST, 15);
    // J136E215          020   14 075    1
    builder.addWord(OP.RA, 14, OP.CLH, 1);
    // J136E216          050   14 020   13
    builder.addWord(OP.ST, 14, OP.RA, 13);
    // J136E217          075    1 050   13
    builder.addWord(OP.CLH, 1, OP.ST, 13);
    // J136E218          060 T  0 010 * 41
    builder.addWord(OP.STQ, 6, OP.TRL, 215);
    // J136E219     * 41 010 ----              EXIT
    builder.addWord(OP.TRL, 0, OP.BLANK, 0);
    // J136E220     * 80 071   13 050 T  4     DATA ROUTINE.
    builder.addWord(OP.CLC, 13, OP.ST, 10)
    // J136E221          020 P  0 050   62
    builder.addWord(OP.RA, 64, OP.ST, 62);
    // J136E222          020 $  0 010 * 40
    builder.addWord(OP.RA, 218, OP.TRL, 204);
    // J136E223          071   34 050   60     STORE SIGN CHARACTER SHIFTED.
    builder.addWord(OP.CLC, 34, OP.ST, 60);
    // J136E224     * 81 020   28 050 * 88
    builder.addWord(OP.RA, 28, OP.ST, 241);
    // J136E225          020 $  0 010 * 40
    builder.addWord(OP.RA, 221, OP.TRL, 204);
    // J136E226          025 P  1 006 * 88     IF DECIMAL POINT GO TO * 88.
    builder.addWord(OP.S, 65, OP.TPR, 241);
    // J136E227          024 P  1 004 P  1
    builder.addWord(OP.A, 65, OP.LM, 65);
    // J136E228          036   61 060   61
    builder.addWord(OP.MA, 61, OP.STQ, 61);
    // J136E229     * 89 020 * 88 025   49
    builder.addWord(OP.RA, 241, OP.S, 49);
    // J136E230          001 * 90 020 * 88
    builder.addWord(OP.TNL, 228, OP.RA, 241);
    // J136E231          025 P  0 014 * 81
    builder.addWord(OP.S, 64, OP.TRR, 220);
    // J136E232     * 90 020 $  0 010 * 20     CONVERT BINARY SCALE FACTOR.
    builder.addWord(OP.RA, 228, OP.TRL, 178);
    // J136E233          020 T  4 002 * 82
    builder.addWord(OP.RA, 10, OP.TPL, 236);
    // J136E234          025   58 001 * 82     IF A SCALE FACTOR GO TO * 82.
    builder.addWord(OP.S, 58, OP.TNL, 236);
    // J136E235          120    0 004   61     FLOATING POINT DATA.
    builder.addWord(OP.CLEAR1, 0, OP.LM, 61);
    // J136E236          044 P  9 036 * 91
    builder.addWord(OP.D, 73, OP.MA, 243);
    // J136E237     * 87 020   60 001 * 86
    builder.addWord(OP.RA, 60, OP.TNL, 235);
    // J136E238          060   61 010 * 70     EXIT
    builder.addWord(OP.STQ, 61, OP.TRL, 150);
    // J136E239     * 86 061   61 010 * 70     EXIT
    builder.addWord(OP.SNQ, 61, OP.TRL, 150);
    // J136E240     * 82 060 T  0 056 * 84     FIXED POINT DATA.
    builder.addWord(OP.STQ, 6, OP.SAR, 239);
    // J136E241          020 * 92 065 * 83
    builder.addWord(OP.RA, 244, OP.SQS, 238);
    // J136E242     * 83 020   62 072 ----     ROUNDING.
    builder.addWord(OP.RA, 62, OP.LRC, 0);
    // J136E243     * 84 024   61 076 ----     APPLY SCALE FACTOR.
    builder.addWord(OP.A, 61, OP.LRH, 0);
    // J136E244          044   62 010 * 87
    builder.addWord(OP.D, 62, OP.TRL, 233);
    // J136E245     * 88 000    0 020 ----
    builder.addWord(OP.BLANK, 0, OP.RA, 0);
    // J136E246          050   62 010 * 89
    builder.addWord(OP.ST, 62, OP.TRL, 225);
    // J136E247     * 91 000,1000 000,0000     CONSTANT
    builder.addWordRaw(0o000_1000_000_0000n);
    // J136E248     * 92 020   62 072   40     DUMMY
    builder.addWord(OP.RA, 62, OP.LRC, 40);
    // J136E249        . 010    0         .
    // builder.addWord(OP.TRL, 0, OP.BLANK, 0);

    // Symbol table starts full of -1's
    builder.updateIndex(400);
    for(let i =0; i < 100; i++){
        builder.addWordRaw(0o100_0000_000_0000n)
    }

    return builder.finalize();
}