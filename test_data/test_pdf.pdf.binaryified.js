function eightToSeven(eightBytes) {
    const seven = 7
    const sevenBytes = eightBytes.slice(0,seven)
    const finalByte = eightBytes[seven]
    const newBytes = new Uint8Array(new ArrayBuffer(seven))
    let index = -1
    for (const each of sevenBytes) {
        index++
        // first seven bits go into respective elements (copied)
        newBytes[index] = each
        
        // same as:
        // if (getBit(finalByte, index)) {
        //     newBytes[index] = setBit(newBytes[index], seven)
        // }
        if (finalByte >> index & 1) {
            newBytes[index] = newBytes[index] | (1 << seven)
        }
    }
    return newBytes
}
function stringToBytes(string) {
    const charCount = string.length
    const buf = new ArrayBuffer(charCount)
    const asciiNumbers = new Uint8Array(buf)
    for (var i=0; i < charCount; i++) {
        asciiNumbers[i] = string.charCodeAt(i)
    }
    const chunksOfEight = asciiNumbers.slice(0,-1)
    let sliceEnd = -asciiNumbers.slice(-1)[0]
    
    const eight = 8
    // chunksOfEight.length/8 should always result in an integer
    const numberOfBlocks = Math.ceil(chunksOfEight.length/eight)
    const arrays = []
    for (let index in [...Array(numberOfBlocks)]) {
        index-=0
        arrays.push(
            eightToSeven(
                chunksOfEight.slice(index*eight,(index+1)*eight)
            )
        )
    }

    // Calculate the total length of the concatenated array
    let totalLength = 0
    for (const arr of arrays) {
        totalLength += arr.length
    }
    
    // Create a new Uint8Array with the total length
    const array = new Uint8Array(totalLength)

    // Copy the elements from each source array into the result array
    let offset = 0
    for (const arr of arrays) {
        array.set(arr, offset)
        offset += arr.length
    }

    if (sliceEnd == 0) {
        sliceEnd = array.length
    }
    return array.slice(0,sliceEnd)
}
let output = stringToBytes(`%PDF-1. 3
%Derexk's PDF
3 0 ob j
<< /F ilter / FlateDe code /L ength 1 255 >>
 stream
 x-WIn#7=s+j(,0M}9NI)x"d\`Q< Cc{|~^1L94Z-6\r?X]%bS1\\j1jq~#_2yo$fMNSLoi>PUwO?O$K_Sy=/TJf)?YS,"?L@I*2z,<$N@+Ls&G2YF #piR*X }&$<$M&\rHd2N,dAc%SJP<HJF-2]hSZjP:ml83LhzHm-Cv	t5RFQ#mMbh=lGX<~Ega39Hd*s!zv0p,p12!e
tR3;dILf%{J1vt<as:bhCc,VfC.,v/<'>R $?a +"7|j@*^#VNP46:n#=Vl<7OWV3x}_YS8R^zHR<G\\)<}uvqp{_WW?otxw%~hf ,Ut8#d+o4}p:r!hele3o'mS#-[T	%.To%B(h!vX#/!i0NQ1F6Y+m7( =9#06(\`+5m,HFGTyYP;M\`(.,84@!%\rV:Xnt/P\`-# q|GX AZ9G(X-s4B(\rtV\`g4 
V3 +YqA Q\`>3Zo5(1kh4@\\+4@aZtnCQDY[pRgh]
!NZEBeoY<\\eV&<FJFe;m<P|!f]\`B\`5tS&Bp\`[,1Jz&B!&:b mqk@]
!J_q!6TJ3#"5&CTrJv@t7:-y-%G?le"{iL .iX(%cyUgaRL25IVR}W,u:O6VYtPOJW\rb(ZR'X>W-]Q'MAVJ:aI4i&Kt[K/6&DjYVls3|"}8Vf+e?+.wa&ze*Zt gK9F1&9e(S1W&3}l-Ds)k M:lRwn\r W?Ay~|H.\`?vgYLHS0C8xMb$SBp bU6{\ryf\`<eGiBHa.

.?teX-HfE;Y+gi$C-5evT~@48YZh''n\`%|,4.VynrovE0I3,^ oKykS=Ql~O~6']um]:OL;~L4{jZ_?w1k*_?Vo	?-m~,oKum_=y}.~O"\`7{6ckwokwx]?>h}8/z-dJdg}<\`K,;bvLvWeJJ/Lq5k&4iSbL]|wHu(#hGVcOc}d\rvs{{ltngCr;ou[Bq"y=-X<_9alg UKU1cDqX{}?d\rmWd2QZ8
PitJ&,SUG/wpBacN"de,i'SL*9?XqS$BGcu"BuJz1st^1k42vD t!\`f"E\\FT2h
$>YnMt0	rQq=5YzAzan#WtFz; ELyP~p[;\`YsBKI4Rg(n2s-bb #mRV Z+&Zl@
^ZEk")+aqE~#p%F@XMAWX+[&9MP'MjG+n+OS[pEUX8[\\09ma Yh:'^1ay6z/l/];
ends tream
e ndobj
1  0 obj
 << /Typ e /Page  /Paren t 2 0 R  /Resou rces 4  0 R /Co ntents  3 0 R / MediaBo x [0 0  612 792 ]
>>
en dobj
4  0 obj
< < /Proc Set [ / PDF /Te xt /Ima geB /Im ageC /I mageI ]  /Color Space < < /Cs1  5 0 R
> > /ExtG State < < /Gs1  10 0 R  >> /Fon t << /T T1 9 0  R >> /X Object  << /Im1  7 0 R
 /Im2 8  0 R >>  >>
endo bj
7 0  obj
<<  /Type / XObject  /Subty pe /Ima ge /Wid th 92 / Height  21 /Col orSpace  5 0 R  /SMask
 11 0 R  /BitsPe rCompon ent 8 / Length  49 /Fil ter /Fl ateDeco de >>
s tream
x mP1   B uOm@a@ 20\`@@ 0\`@ >$ 
endstre am
endo bj
8 0  obj
<<  /Type / XObject  /Subty pe /Ima ge /Wid th 612  /Height  792 /C olorSpa ce 5 0  R
/SMas k 12 0  R /Bits PerComp onent 8  /Lengt h 6881  /Filter  /Flate Decode  >>
stre am
xm\\\`[n[0 PE$}EJn@WEsh	:ax<Hfgv-s @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @ ~#PGyC0d?uN,Pq3w{[V]n#*9gY\rO9sFeu!9hV}Zg[v}vc @\`_8Xk(/uUi2jl^jv<KVUj)ZxTC(	1CUF[mWhvjU*Hsd9unYVKWCG=UL^<xRFo
#|M6Zj9\r|<A=g6WWex~swy\rJ[Sz$@  W)E\`R2NL*3
AQ[Uxd#kgVcjC*b.SXqGcG^%{;o"#
g0MKi.Ju5NY2I3Lm>Ux_2%rzHNW"ki^1sG9<8@zK?JUT
YVEh!32,.|3b_*.p&w(.dLUjWGd#<.OxL_}Ba\\dl><vpTR#*~>FehYy{&!lyjK;	 @\`uz\rg9HZ#q|#n<HNd<z$A;b2	r{\r;b<%GOe7z.JKT*s+_V>w[-^i+?c9xgN/7W#gmR7S;8Y+Gr-4F#y$@  	 @    @    @   p-_yVn @ @O/F?T%uHh:?\\z<_= syO~71wc.x{vD  >B ~]'K!a/*\`\\dPoLT[!sH'x"=;"%U~\`|gb+46e  p3*^}ri<j\`,+8n-wK;FOD  ^E K\\|V8x-y3D7(z$DNh\`lL @  ! @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @ /xVr
endstream
 endobj
 11 0 ob j
<< /T ype /XO bject / Subtype  /Image  /Width  92 /He ight 21  /Color Space / DeviceG ray
/Bi tsPerCo mponent  8 /Len gth 121  /Filte r /Flat eDecode  >>
str eam
xm@PM
  FQ'	$j"A~^<Kh!8Yy9VC,>EbZr2@$r2vR)MoE]F)Mh'z\ryz03[<==6.,[$V':ifS~(PT#[Sy)1x7m2mW|M PO>m;h[1~M35iMjuQg%t]!
9endstre am
endo bj
12 0  obj
<<  /Type  /XObjec t /Subt ype /Im age /Wi dth 612  /Heigh t 792 / ColorSp ace /De viceGra y
/Bits PerComp onent 8  /Lengt h 2886  /Filter  /Flate Decode  >>
stre am
xmX\`]Oe pEk"YZ4?CCCfflM9SB!)&egenTF@l,UxPPPD4R1fYfjQ'mu\\<hP$~^w?Ri8cw6\\Os]Ou_[;n_.g	p @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   p_dHg=X5(y8lxA8ytpFz*xW\\	)m#CH;(/{'-N[7"2c0~Z;<vj>QQ_W?'Sz/?r:51m~tZ,[#qb\\4v-~*;h+wxsiI/27V7^x:bFmhJ_[x8Mm'b{o&7IF#w|}F\`8HeU-rH\rV\rG"n6(b\\CF\`gW7Gbp+bdWT8}.eHD
NS;	&V&%??wE{~rwC9Ek4+.mZyqZzK):V?P5?1#~z%=\rKnUPtdtn:q''>IfF\\]^Ciq=l1
#C>Q\\ruTfe00?vgVksUksF"RceCrMx30Uh_2[7t\\+
 >7J"wQNqsu;G.?6oVDBBz2DE5];>mKwXa\`%{,k|[]\\Ig\\}\`0UcM/D2KIpdeqj]gOE3^
K)1dr_rMouWECQ8x}(nET..^9(pV_w	eBQc;oV;FN>x7Qcq?'"{NoQ]b	x;_{ey%6wN\\H83_e ?o8_^qsIs{uqARq6kdW@aUw#Rc:Gvv\\Zj1ze#?g7j19X_?i3gd&oIMOIl	Li6|-NKH2>}8#5h*~lA059"9:	))i9[	 @ A@,(_Q0k+LY5&(_e;*#tukbg'
3WMB~2H(|cC93W\`HAr;s}_}jD9VFn21}y_,Q=;{3[2^Jf@K-%qm)>8K[W}Yy|KfW+^u(egPnVLO>Qr3/;z0xkc*E2j&V,.J<p=y/cfV.R2Y"pB[^kR65E'Ok*7FfOp7EQSEe->;fKTI T   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   @   @ @   @   @   @    @    @   p?
|H\r96#
e
ndstrea m
endob j
10 0  obj
<<  /Type / ExtGSta te /ca  0.54 >> 
endobj 
13 0 o bj
<< / N 3 /Al ternate  /Devic eRGB /L ength 2 612 /Fi lter /F lateDec ode >>
 stream
 xwTSYO=7=]P" %t!z	 R;HQ	I P&vDF)VdT@@G"cEbW	rVPFAQDEe]k	o-g5s^}GY>_Yg7WYg?o}W: P|MBtX E4!XnkAr\\KDw8X@@affGxD!T|==n(HF3vn.= d;[,?P-&sV",7C$ 
E U6<~&eAS3E2Jt)212!	"Q,"cD/lv]'f+;I{&d!YN&<4;P^]%a#!]\\%\`g#|*e=TI $ew(SSx{L 0_LPg&!l	2En	r D9<ry9h x&gd
	I-b&WieZhHfzq3S;yb1+CM1axLOt4s0 /o2E%YmAhm-mmnYVfhy?Yv_~S}=HQz{Uq&lOjAY_l-l,/= vK$Z3>tU 4m@eDa,Oo  rK 4^s<l^Db9'lllsk.+h7"{oJ?w9wKn{V>;&?#I3eEe&'p&KDLLOd}w[c@9iMICs,@qnhUQh	Y	h;<X-.d
UQa6'~khu_ }9P8I$Ho= C#$n?z} k[1
H>a<h-/s]2z~gz\\
naLA"
Sfvdr%",#_rlAt 
4.0	,\`\r 3p^   H2.Hi@2A>XH 
A1Xvjp Tz1PN6p	\\W@\rp G@
AbK0^ip"A*S$BVUZyCA P8EC	P@yP&5(**!C9P=t#t:D]z P\\ 4}}HSa\rXJ 6 Y0;GBK\`Dx@[arJ8>7Bbap ,J_B@H&QFXqBDBX$!k"$)TE$9V\rHqd!aFKcYab6VaVbJ0UDcVLfE6f3yp%bU1&X',?v	6A\r-DV\`\`%[01Xa.l;G@1bp~8\\2n5.7(W; kC\r?a&qx<*^UoAspVb|!>
_F?l'	ZkB! $l$Tg}PB4Q(eOt"yDH\\b)1XA8<I&N!I$R$)4TIj"]&=&=!PI:dGrY@^O.$ (_%?PH(&OJE BYN9J9@"y@yC%R\r(nTX*:uZO=D}J	}/G3shcI-+kk{%OWw_.'_!J~A&|8QA@'AS#0V!]Fa4B=I.E"bb.b	bb55EQ%<y7O)@i0iR%%!BSE%yR84M4]:ZeZ0G
7\${SiE~th=t	e%e[e(e(ee3JRB0\`x3R	%;s4f9OcO}[6/i^<e)y*n*|"fU*LUoU#U*m*OTW0j&jajY@j{U.+\rOv'OwO_;4d|j0~:	z8zju[Cj=j[>U4F5n%Ieg4?G4hZ5#ZeZg5^0nLTf%39!-.m{'-Q>$]+u=-c(3Xg#N3N]M.[7A7\\7PSwBOK/X /_/Qo!>4Q-$?G>?[J@P 9Z\`AA(u!
!?aa/#ac#*+sQ*#Z#;FU8c6q
q>4c[&0	I9I\rIMSXMT^T\`:O4sOkfh&4	+5;G"0\\}YY,FV 94C<H|#yUy+=XQ]_,mE,S-k,Y)YXm4j\`0zCZDk?]c}GjcXc3N&]f5~-)-_v?mk};]0]4;N;Ovv]"{&{1=
x=wXmtv(;}UXkha8Nq~c'{'1CSI'_YN])N\rN#pT-r
Qqa8rM.d._xp!TU[cZ;kzLMW\rgwvDmD]X=:Y}8{+KGG'zgO^K/WW/7kwbojo'k>:>	>\r>(>v>+}/xa}}vzU]sWpgzW{O8,	!h
$FV>2	 uCAA;l/R_$\\	TB|Cv<	5]zs.,4,A&ly8Ux~
xw-bED CD;HHRvHG\rK\rwFIGEEUTGME{EE KX,Y3dbFZ &=*{$v r)wR]K^clb
cn.73\\3lZr<5e)KO._AYq*_	4B)eL.t_79weW;u{gF+g_\rq]xe|k2QD>D]	cI.KIIcOA5\`u2_rkd)#)?3)Q)Mi^4x4SB%a
0+]3='=/C4#0C:JiUnU"@QL(s\rYf;~L<uH$%UY3j2^g4GeJQL,ftddnK_IsI{~5f5wug>v ~|A5nk/-V.\\[^9Nw]A:aqu>km mHYpKFK\rne_n
^TtQ Q0>\`h3ofFB9B/Qa=-N[lEllm]bf3-j["6^QubKb
vbO%\\k_yY}Wy]Lvxm=%v%{w\`vw\\]bi:sXbY^YP.\`]-^eLr"r7;Wl>Va[q\`id4h2(2=J/j.GU'j$j~f=j{>7mZG[W?_mS\rSE><HwPk-MAmEa\\a,tCOk"j:?g_DmH qOGG%WGBuU;TWW7(76BU\rF1cqG_o}\`uC{+iP3#9xs8!9qbGpxo<YMy
}*i'}Zv6PZ
Z/!V\\V	6$6i{L{_i\` SN-?|tvv3JgKOON9[w~rBFqt	:Wt>:4dR.~0.^K/^q9r)[=v{|U+g.[9];}}=Pm}\rV;__l~iiK5om=ip3[}c->?}gz]{/^Vv:}e{zn.4>{^\\=iU}^}Q).^?Lz8}h$}clc"'
O**?-}lUxWf)=twl W\`O3wg8C/Ny/OCOW)O+F4FjSG-GOyz]z1tEpK}Sc?)?~6wQ+~w{=gbILDpkQk?;J^(>9zVnvmgdhdSuwio&'
^|+>?v}!{{ctGil}OxO\r?:w|	|rx&mff_ws|{
endstream
en dobj
5  0 obj
[  /ICCBa sed 13  0 R ]
e ndobj
2  0 obj
 << /Typ e /Page s /Medi aBox [0  0 612  792] /C ount 1  /Kids [  1 0 R  ] >>
en dobj
14  0 obj
 << /Typ e /Cata log /Pa ges 2 0  R /Ver sion /1 .4 >>
e ndobj
6  0 obj
 [ 1 0 R   /XYZ  36 792  0 ]
end obj
9 0  obj
<<  /Type  /Font / Subtype  /TrueT ype /Ba seFont  /AAAAAB +.SFNS- Regular _wdth_o psz1100 00_GRAD _wght
/ FontDes criptor  15 0 R  /Encod ing /Ma cRomanE ncoding  /First Char 32  /LastC har
119  /Width s [ 281  0 0 0  0 0 0 0  0 0 0  0 0 0 2 97 0 0  0 0 0 0  0 0 0  0 0 0 0 
0 0 0  0 0 0 0  0 0 0  0 0 0 0  0 0 0  0 0 0 0  0 0 0  0 0 0 9 68 0 0  0 0 0 0  0 0
0  552 614  0 614  571 0 6 09 588  247 0 0  253 0  583 591  0 0 38 1 523 3 63 0 54 2
774 ]  >>
end obj
15  0 obj
< < /Type  /FontD escript or /Fon tName / AAAAAB+ .SFNS-R egular_ wdth_op sz11000 0_GRAD_ wght
/F lags 32  /FontB Box [-3 96 -275  2465 9 57] /It alicAng le 0 /A scent 9 67 /Des cent
-2 11 /Cap Height  705 /St emV 0 / XHeight  526 /A vgWidth  581 /M axWidth  2493 / FontFil e2
16 0  R >>
e ndobj
1 6 0 obj 
<< /Le ngth1 3 636 /Le ngth 20 12 /Fil ter /Fl ateDeco de >>
s tream
x -V{pUb}_~5jQ[QG+TJ"Rb#aCbDr\`na&<4xq !a!E hZ2TW:t1j|#\`zN*YvWd_=_nH:N'kL{;wysOw^g\\[:[= _B47"\\;mZ^*)ogCn uzRbpDoU::T
vnVzsiEm}NW]8^97~n0>-"\\gc?>a~8"dX'?j,VqU55q8]*k?~}1H1<&Tf"r13o-8vF\\aOpH]g6G?83<z^%wR\\:B;\`Zac{Mhg1*1,z^th*ZaRo$	nSD"R@{E^'h1W,w~ yuf~4;Qle&?-^J4&#Ly=	1^d&N\\Lwvc30@6t%	>yI2Jn{w/eMBv>|p^-C8B$ydF)<\`wWaK(Z] \\ma,E5G?999n)@]@Y\`e/UIKt^\r^G,	.?H(lphsh| /
bu<@syPn=@y7dm/>4Fdgtgi\r/mvP ^\`1l%IO0KItF M]N*fF>fYXO9=Is,vFn>/hY+WIRO\`K+|bXDSw=]	HwQ[+M_[c!shX3ss*Q0nLa\\F	u\\L5Lfz~F
k\`D*Avp'\\HXJ>O'0H)b5N\\NncQFSZ_?|\`pO @
[0CPpu*.cn^T6 Rob{kcld3_70E.J'G)BuXMl<@=,cVF_8U\\+h+gioipbq|{Bz4aTc^0oFvmB*<-lk\`3%F/r3	Hlt9:04CAAnHj0nsi\ru(B\\,AdCM},5?'l^/c"S1g|-[y+4)*C/~]u(>)cUM
0_v1{47t/-J}OIDe{LuR.GAu7PFzs\r7s-7]:A5Iwa	 XMO8Iv>*{GqY#Q#
o CVp?P7k=%OlLv1=\\'{MHG\`Ea'iJKz@%]B\rAvt|SP)9R8SZg3HlVB0,\\";JB0%Y"?f,\\V"XoQw#hYB=&x~i-s7 X(]Z'([8LeTI[E\r<H&#M	4
3uW7dFtK2nN 4+?O[8[J@u8n-C	<\`[jzN\`?y_\`j1{>m(Q B6\`| AyWx}%sOqR$vHT[ASv,?!ekM,,c+<q2thVS"I2 *n+5^KWwcNFts8#Mf*OrC~M
[Q\rofs/L1_>hsbeNb&%W(WU^
bBL+Ahdf.\`3)5UJV^c
QQ>[!}{QoB]*)S]'eRL7l\`!>&>Fk9VH\`Ki8W9'r,XL4*QKI]IE;<\`302erK<9[ZP)10EVZdU6Q+Z6<!J3ke/o7.{EnZy}n% ,UwY_S<\`(|.
sx-47,a.UbO<-G
NT?$6 P$;cfY\\6*)I-R-YX<'Fhbt~p|@l0B\\UYy8ZL;x.D[7XqFkgm702	JbZhHB 5zP@>G}\`jCK>P}c%)4k$y@~4j.h}.8d> agdk@T4\${UmNlc+qS"cO!NI^;KU
Aou175Jy%FzsN|\rjsAU}zM:eh<uK]T}o5+UE[%iE5*R-gQ}%Oy1]km/sTW&MVBK3M]$e-Z7z~sJn4~~3Vt[s^DqHCP;|_$3
Xb_x<Kyq5TYiXO{-v(Ow;zIMZ9U[KVMe:B_D=+2"W;I)|yp_N\\k_I?D5>W\`{AM&G/$XAw}Zn7cU$m3.IbUZxfZZ:}83U8<b<$)Z|CC|N	Mr#t)>|1x%*qbm|9j-sdT5V):w9oSuq9VY8t=CtMRj2+F#>8[4gWtJ;Sr;.u[Sld/x#:\`*)sq=;BoE&a8KOsnsp
})Qy.7L\\Ci8_Ue@|EO*StR\rzesW/a.QTEsN00y4p<q~StJ\\ a\\1KC![$Vn<g:=W	Ni}%j:eg#4HT\r\\\rV%lxl"g=3Ebd7fahcj9*^(X\`?
~M8TDgH(lVj(Ud7ww<]bPN~Cwo@>*Y-=yy_  <
(sm,\r/b>g=J|TEFW+~:F{w"z}a>MN7CSxN|b1TR)kO;#urP](J{P(3T'43<$XCj)Z3q^2f%6n\`0QB#Eo dqpiyNM;3078dAy8:c0.R[ZXYUS8rd:F"a\\LB:RZUgfB
endstream
e ndobj
1 7 0 obj 
<< /Ti tle (Ne w Tab)  /Produc er (mac OS Vers ion 12. 6 \\(Bui ld 21G1 15\\) Qu artz PD FContex t)
/Cre ator (Z en Brow ser) /C reation Date (D :202503 2521351 6Z00'00 ') /Mod Date (D :202503 2521351 6Z00'00 ')
>>
e ndobj
x ref
0 1 8
00000 00000 6 5535 f  
000000 1350 00 000 n 
 0000015 070 000 00 n 
0 0000000 22 0000 0 n 
00 0000145 4 00000  n 
000 0015034  00000  n 
0000 015217  00000 n  
00000 01641 0 0000 n  
000000 1865 00 000 n 
 0000015 257 000 00 n 
0 0000122 73 0000 0 n 
00 0000892 5 00000  n 
000 0009215  00000  n 
0000 012321  00000 n  
00000 15153 0 0000 n  
000001 5670 00 000 n 
 0000015 938 000 00 n 
0 0000180 38 0000 0 n 
tr ailer
< < /Size  18 /Ro ot 14 0  R /Inf o 17 0  R /ID [  <88755 1b2daf0 88ae9a3 64726e1 11fafa> 
<88755 1b2daf0 88ae9a3 64726e1 11fafa>  ] >>
s tartxre f
18241 
%%EOF
  `)
const relativePathToOriginal = "test_pdf.pdf"
try {
    if (relativePathToOriginal && globalThis?.Deno?.readFileSync instanceof Function) {
        const { FileSystem } = await import("https://deno.land/x/quickr@0.6.72/main/file_system.js")
        // equivlent to: import.meta.resolve(relativePathToOriginal)
        // but more bundler-friendly
        const path = `${FileSystem.thisFolder}/${relativePathToOriginal}`
        const current = await Deno.readFile(path)
        const original = output
        output = current

        // update the file whenever (no await)
        const thisFile = FileSystem.thisFile // equivlent to: import.meta.filename, but more bundler-friendly
        setTimeout(async () => {
            try {
                const changeOccured = !(current.length == original.length && current.every((value, index) => value == original[index]))
                // update this file
                if (changeOccured) {
                    const { binaryify } = await import("https://deno.land/x/binaryify@2.5.5.0/binaryify_api.js")
                    await binaryify({
                        pathToBinary: path,
                        pathToBinarified: thisFile,
                        forceExportString: false,
                    })
                }
            } catch (e) {
            }
        }, 0)
    }
} catch (e) {
    
}
        
export default output